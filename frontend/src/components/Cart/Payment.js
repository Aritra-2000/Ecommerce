import React, { Fragment, useRef, useEffect } from 'react'
import CheckoutSteps from './CheckoutSteps.js'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData.js'
import { useAlert } from 'react-alert'
import axios from 'axios'
import './payment.css'
import { MdCreditCard, MdEvent, MdVpnKey } from 'react-icons/md'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { clearErrors, createOrder } from '../../actions/orderAction.js'
import {CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements} from '@stripe/react-stripe-js'

const Payment = () => {

    
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const payBtn = useRef(null);
    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();


    const {shippingInfo, cartItems} = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.user);
    const {error} = useSelector((state) => state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
      };

    
    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
        
            const {data} = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            if(!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },  
                    },
                },
            });

            if(result.error){
                payBtn.current.disabled = false;

                alert.error(result.error.message);
            } else {
                if(result.paymentIntent.status === 'succeeded') {

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    dispatch(createOrder(order));

                    navigate("/success");
                } else {
                    alert.error("There's some issue while processing payment");
                }
            }   
        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }

       
      };

      useEffect (() => {
        if(error){
          alert.error(error);
          dispatch(clearErrors());
        }
      },[dispatch, error, alert]);

    return (
        <Fragment>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <MdCreditCard />
                        <CardNumberElement className='paymentInput' />
                    </div>
                    <div>
                        <MdEvent />
                        <CardExpiryElement className='paymentInput' />
                    </div>
                    <div>
                        <MdVpnKey />
                        <CardCvcElement className='paymentInput' />                        
                    </div>
                    <input
                        type='submit'
                        ref={payBtn}
                        value={`pay - ${orderInfo && orderInfo.totalPrice}`}
                        className='paymentFormBtn'
                    />
                </form>
            </div>
        </Fragment>
    )
}

export default Payment;