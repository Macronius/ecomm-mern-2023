import { useEffect } from "react";
// routing
import { Link, useParams } from "react-router-dom";
// app state
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
// ui
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
// components
import Message from "../components/Message";
import Loader from "../components/Loader";
// payment ui
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
// ux
import { toast } from "react-toastify";

// NOTE: once on this screen, the transaction should be over, therefore cart should reset

const OrderScreen = () => {
  // get the id from the url path
  const { id: orderId } = useParams();
  // console.log(orderId ? orderId : "no orderId");

  // get user data
  const { userInfo } = useSelector((state) => state.auth);

  // get data from order api, prevent stale data with refetch()
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId); // Q-19
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // Q-21
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  //
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  //
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      //
      const loadPayPalScript = async () => {
        // call once
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        // call twice
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      //
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // handler functions
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });  // note: details would come from paypal, since paypal not calling this, details: {payer: {}} is the emprovise
  //   refetch();
  //   toast.success("Order is paid");
  // }
  //
  function createOrder(data, actions) {
    // inspect this actions object's methods
    console.log(actions);
    //
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice
          }
        }
      ]
    }).then((orderId) => {
      return orderId;
    })
  }
  //
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        console.log(err?.data?.message || err.error)
      }
    });
  }
  //
  function onError(err) {
    toast.error(err.message)
  }
  //
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  //
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" error={error} />
  ) : (
    <>
      <h1>Order: #{orderId}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Shipping Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered yet</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method:</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">
                  Order completion pending payment
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((d, i) => (
                <ListGroup.Item key={i}>
                  <Row>
                    <Col md={1}>
                      <Image src={d.image} alt={d.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${d.product}`}>{d.name}</Link>
                    </Col>
                    <Col md={4}>
                      {d.qty} x {d.price} = {d.qty * d.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxAmount}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {
                /* PAY ORDER BUTTON - do not display pay button if order already paid */
                !order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {/* <Button
                          onClick={onApproveTest}
                          style={{ marginBottom: "10px" }}
                        >
                          Test Pay Order
                        </Button> */}
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                )
              }

              {
                loadingDeliver && <Loader />
              }
              {
                userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )
              }
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
