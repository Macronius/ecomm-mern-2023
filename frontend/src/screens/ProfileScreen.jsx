// js library
import { useEffect, useState } from "react";
// routing
import { LinkContainer } from "react-router-bootstrap";
// application state
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
// ui ux
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import {FaTimes} from 'react-icons/fa'
// components
import Message from "../components/Message";
import Loader from "../components/Loader";

const ProfileScreen = () => {
  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //
  const dispatch = useDispatch();
  //
  const { userInfo } = useSelector((state) => state.auth);
  //
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  //
  useEffect(() => {
    // set component state to match application state: name & email
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);
  // Q-22:

  //
  const submitHandler = async (e) => {
    e.preventDefault();
    //
    if (password !== confirmPassword) {
      toast.error("Passwords must match");
    } else {
      try {
        // action brought from the api slice
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        // NOTE: this process updates expirationTime to 30days
        dispatch(setCredentials(res));
        //
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row>
      {/* user's profile section */}
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>

      {/* user's orders section */}
      <Col md={9}>
        <h2>My Orders</h2>
        {
            isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                <Message variant="success">Looking good</Message>
                <Table striped hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map( order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        {
                                            order.isPaid ? (
                                                order.paidAt.substring(0,10)
                                            ) : (
                                                <FaTimes style={{color: 'red'}} />
                                            )
                                        }
                                    </td>
                                    <td>
                                        {
                                            order.isDelivered ? (
                                                order.deliveredAt.substring(0,10)
                                            ) : (
                                                <FaTimes style={{color: 'red'}} />
                                            )
                                        }
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm" variant="light">Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                </>
            )
        }
      </Col>
    </Row>
  );
};

export default ProfileScreen;
