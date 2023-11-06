import { useEffect, useState } from "react";
// routing
import { Link, useLocation, useNavigate } from "react-router-dom";
// ui framework components
import { Form, Button, Row, Col } from "react-bootstrap";
// other components
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
// import CheckoutSteps from "../components/CheckoutSteps";
// to interact with the state
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
// alerts
import { toast } from "react-toastify";

const LoginScreen = () => {
  // component state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // application state
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation(); // Q-07, NOTE: login could be called loginApiCall for consistancy
  const { userInfo } = useSelector((state) => state.auth);
  // routing/navigation
  const navigate = useNavigate();
  // cart screen to checkout, if not logged in, then redirect to sign in screen, else checkout
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search); // URLSearchParams() constructor
  const redirect = searchParams.get("redirect") || "/"; // get redirect value from URLSearchParams, then check
  //
  useEffect(() => {
    if (userInfo) {
      // Q-09
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // login by calling 'login' from the userApiSlice and 'setCredentials' from the authSlice
    try {
      const res = await login({ email, password }).unwrap(); // unwrap the resolved value from the promise
      //
      dispatch(setCredentials({ ...res }));
      //
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      {/* <CheckoutSteps step1 /> */}

      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Submit
        </Button>
        {
          /* check if logging in (not page) is loading */
          isLoading && <Loader />
        }
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;

/*
 *  because a logged in user's credentials are stored in localStorage, useEffect can hook upon initial render to determine if a user is already signed in when going to the login screen.
 */
