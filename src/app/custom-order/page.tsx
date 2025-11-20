'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CheckCircle, ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

const steps = ['Event Details', 'Cake Design', 'Review & Submit'];

const eventTypes = [
  'Wedding',
  'Birthday',
  'Anniversary',
  'Baby Shower',
  'Graduation',
  'Corporate Event',
  'Engagement',
  'Holiday Celebration',
  'Other',
];

export default function CustomOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState((session?.user as any)?.email || '');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
  const [servings, setServings] = useState<number>(50);
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [flavors, setFlavors] = useState('');
  const [colors, setColors] = useState('');
  const [theme, setTheme] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [referenceImages, setReferenceImages] = useState('');

  const handleNext = () => {
    if (activeStep === 0) {
      if (!name || !email || !phone || !eventType || !eventDate || !servings) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (activeStep === 1) {
      if (!description) {
        setError('Please provide a description of your cake');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        name,
        email,
        phone,
        eventType,
        eventDate: eventDate?.toISOString(),
        servings,
        budget: budget ? Number(budget) : null,
        description,
        flavors: flavors || null,
        colors: colors || null,
        theme: theme || null,
        specialRequests: specialRequests || null,
        referenceImages: referenceImages
          ? referenceImages.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await axios.post('/api/custom-orders', payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Request Submitted! 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Thank you for your custom cake order request. Our team will review your requirements
                and get back to you within 24-48 hours with a quote and design proposal.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                We've sent a confirmation email to <strong>{email}</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => router.push('/cakes')}>
                  Browse Our Cakes
                </Button>
                <Button variant="outlined" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 6 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
              Custom Cake Order
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: 'center' }}
            >
              Design your dream cake! Tell us about your event and vision.
            </Typography>

            <Paper sx={{ p: 4 }}>
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

              {/* Step 1: Event Details */}
              {activeStep === 0 && (
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Event Information
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      required
                      fullWidth
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        value={eventType}
                        label="Event Type"
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Event Date"
                        value={eventDate}
                        onChange={(newValue) => setEventDate(newValue)}
                        minDate={dayjs().add(7, 'day')}
                        slotProps={{ textField: { fullWidth: true, required: true } }}
                      />
                    </LocalizationProvider>
                    <TextField
                      label="Number of Servings"
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(Number(e.target.value))}
                      required
                      fullWidth
                      inputProps={{ min: 10 }}
                    />
                  </Box>

                  <TextField
                    label="Budget (Optional)"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 10000"
                    fullWidth
                    helperText="Approximate budget in KSh (helps us provide suitable options)"
                  />
                </Box>
              )}

              {/* Step 2: Cake Design */}
              {activeStep === 1 && (
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cake Design Preferences
                  </Typography>

                  <TextField
                    label="Describe Your Vision"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    required
                    fullWidth
                    placeholder="Tell us about the cake you envision... style, tiers, decorations, etc."
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Preferred Flavors (Optional)"
                      value={flavors}
                      onChange={(e) => setFlavors(e.target.value)}
                      fullWidth
                      placeholder="e.g., Vanilla, Chocolate, Red Velvet"
                    />
                    <TextField
                      label="Color Scheme (Optional)"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                      fullWidth
                      placeholder="e.g., White & Gold, Pastel Pink"
                    />
                  </Box>

                  <TextField
                    label="Theme (Optional)"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    fullWidth
                    placeholder="e.g., Rustic, Modern, Floral, Disney Princess"
                  />

                  <TextField
                    label="Special Requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Any dietary restrictions, allergies, or special requirements?"
                  />

                  <TextField
                    label="Reference Image URLs (Optional)"
                    value={referenceImages}
                    onChange={(e) => setReferenceImages(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Paste image URLs separated by commas"
                    helperText="Share Pinterest, Instagram, or other inspiration photos"
                  />
                </Box>
              )}

              {/* Step 3: Review */}
              {activeStep === 2 && (
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Review Your Order
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Event Details
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Name:</Typography>
                        <Typography>{name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Email:</Typography>
                        <Typography>{email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Phone:</Typography>
                        <Typography>{phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Event Type:</Typography>
                        <Typography>{eventType}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Event Date:</Typography>
                        <Typography>{eventDate?.format('MMM DD, YYYY')}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Servings:</Typography>
                        <Typography>{servings}</Typography>
                      </Box>
                      {budget && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Budget:</Typography>
                          <Typography>KSh {Number(budget).toLocaleString()}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Design Preferences
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <Box>
                        <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                          Description:
                        </Typography>
                        <Typography>{description}</Typography>
                      </Box>
                      {flavors && (
                        <Box>
                          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                            Flavors:
                          </Typography>
                          <Typography>{flavors}</Typography>
                        </Box>
                      )}
                      {colors && (
                        <Box>
                          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                            Colors:
                          </Typography>
                          <Typography>{colors}</Typography>
                        </Box>
                      )}
                      {theme && (
                        <Box>
                          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                            Theme:
                          </Typography>
                          <Typography>{theme}</Typography>
                        </Box>
                      )}
                      {specialRequests && (
                        <Box>
                          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                            Special Requests:
                          </Typography>
                          <Typography>{specialRequests}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>

                  <Alert severity="info">
                    After submitting, our team will review your request and send you a custom quote
                    within 24-48 hours. Custom cakes require at least 7 days advance notice.
                  </Alert>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {activeStep > 0 && (
                  <Button onClick={handleBack} startIcon={<ArrowBack />} disabled={loading}>
                    Back
                  </Button>
                )}
                <Box sx={{ flex: 1 }} />
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    disabled={loading}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                  </Button>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
