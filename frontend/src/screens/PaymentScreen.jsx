import {useEffect, useState} from 'react';
// routing
import {useNavigate} from 'react-router-dom';
// state
import {useDispatch, useSelector} from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice';
// ui
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import {Form, Button, Col} from 'react-bootstrap';

const PaymentScreen = () => {
    // routing
    const navigate = useNavigate();
    //
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    //
    const dispatch = useDispatch();
    // const cart = useSelector(state => state.cart);
    // const {shippingAddress} = cart;
    const {shippingAddress} = useSelector(state => state.cart);
    //
    useEffect(() => {
        if (!shippingAddress) {
            navigate("/shipping")
        }
    }, [shippingAddress, navigate]); // Q-13
    //
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    };

    //
  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as="legend">Select payment method</Form.Label>
                <Col>
                    <Form.Check 
                        type="radio"
                        className="my-2"
                        label="PayPal or Credit Card"
                        id="PayPal"
                        name="paymentmethod"
                        value="PayPal"
                        checked
                        onChange={e=> setPaymentMethod(e.target.value)}
                    />
                </Col>
            </Form.Group>

            <Button type="submit" variant="primary">Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen