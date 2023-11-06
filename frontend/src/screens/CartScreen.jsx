// routing
import { Link, useNavigate } from "react-router-dom";
// global state
import { useDispatch, useSelector } from "react-redux";
import {addToCart, removeFromCart} from "../slices/cartSlice"
// components
import {
  Row,
  Col,
  Card,
  Image,
  ListGroup,
  Form,
  Button,
} from "react-bootstrap";
import Message from "../components/Message";
// style
import { FaTrash } from "react-icons/fa";

const CartScreen = () => {
  // routing
  const navigate = useNavigate();
  // global state
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  // handler function(s)
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({...product, qty}))
  }
  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  }
  //
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  //
  return (
    <Row>
      {/* 1st col */}
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <>
            <Message>
              Your cart is empty <Link to="/">Go back</Link>
            </Message>
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => {
              console.log(`data retrieved from CartScreen:`);
              console.log(item)
              return (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={3}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id)}>
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Col>
      {/* 2nd col */}
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                items
              </h2>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
