import {useEffect} from 'react';
// routing
import {Link, useNavigate} from 'react-router-dom';
// app state
import {useDispatch, useSelector} from 'react-redux';
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import {clearCartItems} from '../slices/cartSlice';
// ui / ux
import {Button, Card, Col, Image, ListGroup, Row} from 'react-bootstrap';
import {toast} from 'react-toastify'
// functional components
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
  //
  const navigate = useNavigate();
  //
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart)
  const [createOrder, {isLoading, error}] = useCreateOrderMutation();

  // check app state for shipping address and paymentmethod
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate])

  // handler function
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxAmount,
        totalPrice: cart.totalPrice,
      }).unwrap();
      //
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err)
    }
  }

  //
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>{" "}
                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.map( (d,i) => (
                <ListGroup key={i}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={d.image}
                        alt={d.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <Link to={`/products/${d.product}`}>{d.name}</Link>
                    </Col>
                    <Col md={4}>
                      {`${d.qty} x ${d.price} = ${d.qty * d.price}`}
                    </Col>
                  </Row>
                </ListGroup>
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
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  {/* TODO-03: find where shippingPrice comes from, set two decimal places */}
                  <Col>${cart.shipppingPrice ? cart.shippingPrice : 0}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxAmount}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button 
                  type="button" 
                  className="btn-block" 
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>

                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen