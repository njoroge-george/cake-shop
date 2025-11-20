'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dayjs, { Dayjs } from 'dayjs';
import Header from '@/components/layout/Header';
import { useCartStore } from '@/store/cartStore';
import axios from 'axios';

const steps = ['Delivery Details', 'Delivery Date & Time', 'Payment'];

const deliverySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .matches(/^254[0-9]{9}$/, 'Phone must be in format 254XXXXXXXXX')
    .required('Phone is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  county: Yup.string().required('County is required'),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();

  const [activeStep, setActiveStep] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<Dayjs | null>(dayjs().add(2, 'day'));
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM - 12:00 PM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paybillNumber, setPaybillNumber] = useState('');
  const [paybillAccount, setPaybillAccount] = useState('');
  const [paybillNote, setPaybillNote] = useState('');

  const deliveryFee = parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || '500');
  const subtotal = getTotal();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; amount: number } | null>(null);
  const total = subtotal + deliveryFee - (promoApplied?.amount || 0);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
    if (items.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
    // Load paybill settings for display
    (async () => {
      try {
        const res = await axios.get('/api/settings/paybill');
        setPaybillNumber(res.data.number || '');
        setPaybillAccount((prev) => prev || res.data.defaultAccount || '');
        setPaybillNote(res.data.note || '');
      } catch (e) {
        console.error('Failed to load paybill settings', e);
      }
    })();
  }, [session, items]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async (deliveryInfo: any) => {
    try {
      setLoading(true);
      setError('');

      const orderData = {
        addressId: null, // Will be created inline or use existing
        deliveryDate: deliveryDate?.toISOString(),
        deliveryTime,
        items: items.map(item => ({
          cakeId: item.cakeId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedFlavor: item.selectedFlavor,
          selectedLayers: item.selectedLayers,
          customMessage: item.customMessage,
          specialRequests: item.specialRequests,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        discount: promoApplied?.amount || 0,
        total,
        promoCode: promoApplied?.code || undefined,
        // Manual Paybill payment details
        paybillNumber,
        paybillAccount: paybillAccount || orderNumber,
        address: deliveryInfo,
      };

      const response = await axios.post('/api/orders', orderData);

      if (response.data.order) {
        setOrderSuccess(true);
        setOrderNumber(response.data.order.orderNumber);
        clearCart();

        // Show success message and Paybill instructions
        alert(
          `Order placed successfully!\n\n` +
          `Order Number: ${response.data.order.orderNumber}\n` +
          `Amount: KSh ${total.toLocaleString()}\n\n` +
          `Please pay via M-Pesa Paybill: ${paybillNumber}\n` +
          `Use Account Number: ${paybillAccount || response.data.order.orderNumber}`
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Order Placed Successfully! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your order number is: <strong>{orderNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              We've sent a confirmation email to your registered email address.
              You'll receive updates as we prepare your delicious cake!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/orders')}
              sx={{ mb: 2 }}
            >
              View My Orders
            </Button>
            <br />
            <Button
              variant="outlined"
              onClick={() => router.push('/cakes')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
          Checkout
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
          <Box>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Formik
                initialValues={{
                  name: session?.user?.name || '',
                  phone: '',
                  street: '',
                  city: '',
                  county: '',
                }}
                validationSchema={deliverySchema}
                onSubmit={(values) => {
                  if (activeStep === 0) {
                    handleNext();
                  } else if (activeStep === 1) {
                    handleNext();
                  } else {
                    if (!paybillAccount.trim()) {
                      setError('Please enter the Account Number you will use when paying via Paybill.');
                      return;
                    }
                    handlePlaceOrder(values);
                  }
                }}
              >
                {({ errors, touched, values, handleChange, handleBlur, isValid }) => (
                  <Form>
                    {activeStep === 0 && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                          Delivery Information
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 2,
                          }}
                        >
                          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <TextField
                              fullWidth
                              name="name"
                              label="Full Name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.name && Boolean(errors.name)}
                              helperText={touched.name && errors.name}
                            />
                          </Box>
                          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <TextField
                              fullWidth
                              name="phone"
                              label="Phone Number (M-Pesa)"
                              placeholder="254712345678"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.phone && Boolean(errors.phone)}
                              helperText={touched.phone && errors.phone}
                            />
                          </Box>
                          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <TextField
                              fullWidth
                              name="street"
                              label="Street Address"
                              value={values.street}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.street && Boolean(errors.street)}
                              helperText={touched.street && errors.street}
                            />
                          </Box>
                          <Box>
                            <TextField
                              fullWidth
                              name="city"
                              label="City"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.city && Boolean(errors.city)}
                              helperText={touched.city && errors.city}
                            />
                          </Box>
                          <Box>
                            <FormControl fullWidth>
                              <InputLabel>County</InputLabel>
                              <Select
                                name="county"
                                value={values.county}
                                label="County"
                                onChange={handleChange}
                                error={touched.county && Boolean(errors.county)}
                              >
                                <MenuItem value="Nairobi">Nairobi</MenuItem>
                                <MenuItem value="Kiambu">Kiambu</MenuItem>
                                <MenuItem value="Machakos">Machakos</MenuItem>
                                <MenuItem value="Kajiado">Kajiado</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {activeStep === 1 && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                          Delivery Date & Time
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Delivery Date"
                            value={deliveryDate}
                            onChange={(newValue) => setDeliveryDate(newValue)}
                            minDate={dayjs().add(2, 'day')}
                            sx={{ width: '100%', mb: 3 }}
                          />
                        </LocalizationProvider>

                        <FormControl fullWidth>
                          <InputLabel>Delivery Time</InputLabel>
                          <Select
                            value={deliveryTime}
                            label="Delivery Time"
                            onChange={(e) => setDeliveryTime(e.target.value)}
                          >
                            <MenuItem value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</MenuItem>
                            <MenuItem value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</MenuItem>
                            <MenuItem value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</MenuItem>
                            <MenuItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</MenuItem>
                            <MenuItem value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</MenuItem>
                          </Select>
                        </FormControl>

                        <Alert severity="info" sx={{ mt: 3 }}>
                          Please order at least 2 days in advance for custom cakes.
                        </Alert>
                      </Box>
                    )}

                    {activeStep === 2 && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                          Payment via M-Pesa Paybill
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                          To complete payment, open your M-Pesa app and pay using the Paybill details below. After paying, we'll verify and confirm your order.
                        </Alert>

                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Amount to Pay:
                          </Typography>
                          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                            KSh {total.toLocaleString()}
                          </Typography>
                        </Paper>

                        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                          <TextField
                            label="Paybill Number"
                            value={paybillNumber}
                            InputProps={{ readOnly: true }}
                            fullWidth
                          />
                          <TextField
                            label="Account Number"
                            placeholder={orderNumber || 'e.g. your phone or order number'}
                            value={paybillAccount}
                            onChange={(e) => setPaybillAccount(e.target.value)}
                            fullWidth
                            required
                          />
                        </Box>
                        {paybillNote && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            {paybillNote}
                          </Alert>
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                      {activeStep > 0 && (
                        <Button
                          onClick={handleBack}
                          startIcon={<ArrowBack />}
                          disabled={loading}
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        endIcon={activeStep < 2 ? <ArrowForward /> : undefined}
                        disabled={loading || (activeStep === 0 && !isValid)}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : activeStep === 2 ? (
                          'Place Order'
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Box>

          {/* Order Summary */}
          <Box>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.cake?.name} x {item.quantity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.selectedSize}, {item.selectedFlavor}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>KSh {subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Delivery</Typography>
                  <Typography>KSh {deliveryFee.toLocaleString()}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Promo Code */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={async () => {
                    try {
                      const res = await axios.get('/api/promo-codes/validate', { params: { code: promoCode, subtotal } });
                      if (res.data.valid) {
                        setPromoApplied({ code: res.data.promo.code, amount: res.data.promo.discountAmount });
                      } else {
                        setPromoApplied(null);
                        alert(res.data.error || 'Invalid code');
                      }
                    } catch (e: any) {
                      setPromoApplied(null);
                      alert(e.response?.data?.error || 'Invalid code');
                    }
                  }}
                >
                  Apply
                </Button>
              </Box>
              {promoApplied && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Promo ({promoApplied.code})</Typography>
                  <Typography color="success.main">- KSh {promoApplied.amount.toLocaleString()}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  KSh {total.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
}
