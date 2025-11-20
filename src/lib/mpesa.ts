import axios from 'axios';

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa token error:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

function generatePassword(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
  const passkey = process.env.MPESA_PASSKEY;
  const shortcode = process.env.MPESA_SHORTCODE;
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

function getTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

interface STKPushParams {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export async function initiateMpesaPayment({
  phoneNumber,
  amount,
  accountReference,
  transactionDesc,
}: STKPushParams) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();

    // Format phone number (remove + and ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data,
      checkoutRequestId: response.data.CheckoutRequestID,
      merchantRequestId: response.data.MerchantRequestID,
    };
  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.errorMessage || 'Payment initiation failed',
    };
  }
}

export async function queryMpesaTransaction(checkoutRequestId: string) {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('M-Pesa query error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.errorMessage || 'Transaction query failed',
    };
  }
}

export function parseMpesaCallback(callbackData: any) {
  const { Body } = callbackData;
  const { stkCallback } = Body;

  if (stkCallback.ResultCode === 0) {
    // Payment successful
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
    const mpesaRef = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
    const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

    return {
      success: true,
      amount,
      mpesaRef,
      phoneNumber,
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
    };
  } else {
    // Payment failed or cancelled
    return {
      success: false,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
    };
  }
}
