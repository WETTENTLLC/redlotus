import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalPaymentProps {
  amount: number;
  productTitle: string;
  productType: 'music' | 'video' | 'ticket';
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ 
  amount, 
  productTitle, 
  productType, 
  onSuccess, 
  onError 
}) => {
  // PayPal Client ID (use sandbox for development, production for live)
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"; // sandbox default
  const initialOptions = {
    clientId: paypalClientId,
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: "USD"
          },
          description: `${productTitle} - ${productType}`,
          custom_id: `${productType}_${Date.now()}`
        }
      ]
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log('PayPal payment successful:', details);
      onSuccess(details);
    });
  };

  return (
    <div className="paypal-payment-container">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal"
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment;
