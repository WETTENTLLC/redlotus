import React, { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SecurityService } from '../../security/SecurityService';

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
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [clientId, setClientId] = useState<string>('');

  useEffect(() => {
    // Validate payment amount
    setIsValidAmount(SecurityService.validatePaymentAmount(amount));
    
    // Get and validate PayPal client ID
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!paypalClientId || paypalClientId.includes('MISSING')) {
      onError(new Error('PayPal configuration missing'));
      return;
    }
    setClientId(paypalClientId);
  }, [amount, onError]);

  if (!isValidAmount) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded">
        Invalid payment amount. Please contact support.
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="text-yellow-600 p-4 border border-yellow-300 rounded">
        Payment system is currently unavailable.
      </div>
    );
  }
  const createOrder = (data: any, actions: any) => {
    // Additional security check before creating order
    if (!SecurityService.validatePaymentAmount(amount)) {
      throw new Error('Invalid payment amount');
    }

    const sanitizedTitle = SecurityService.sanitizeInput(productTitle);
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD"
          },
          description: `${sanitizedTitle} - ${productType}`,
          custom_id: `${productType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      ]
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      // Validate payment details before success callback
      if (details.status === 'COMPLETED' && details.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED') {
        console.log('PayPal payment successful:', details.id);
        onSuccess(details);
      } else {
        onError(new Error('Payment not completed successfully'));
      }
    }).catch((error: any) => {
      console.error('Payment capture error:', error);
      onError(error);
    });
  };

  const initialOptions = {
    clientId: clientId,
    currency: "USD",
    intent: "capture",
    "disable-funding": "credit,card"
  };

  return (
    <div className="paypal-payment-container">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          Amount: ${amount.toFixed(2)} USD
        </p>
        <p className="text-xs text-blue-600">
          Secure payment powered by PayPal
        </p>
      </div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(error) => {
            console.error('PayPal error:', error);
            onError(error);
          }}
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
