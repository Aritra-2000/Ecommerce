import { Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import { MdAccountBalance, MdLibraryAddCheck, MdLocalShipping } from 'react-icons/md'

const CheckoutSteps = ({activeStep}) => {

    const steps = [
        {
            label:<Typography>Shipping Details</Typography>,
            icon: <MdLocalShipping/>,
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <MdLibraryAddCheck/>,
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <MdAccountBalance/>,
        },
    ];

    const stepStyles = {
        boxSizing: "border-box"
    };

  return (
    <Fragment>
    <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
            <Step key={index}>
              <StepLabel  style={{
                  color: activeStep >= index ? "tomato" : "rgba(0 , 0, 0, 0.649)"
              }} icon={item.icon}>{item.label}</StepLabel>
            </Step>
        ))}
    </Stepper>
    </Fragment>
  )
}

export default CheckoutSteps