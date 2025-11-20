import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || '"Cake Shop" <noreply@cakeshop.com>',
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export function orderConfirmationEmail(orderNumber: string, customerName: string, total: number, deliveryDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF69B4; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #FF69B4; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎂 Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${customerName},</h2>
          <p>Thank you for your order! We're excited to create your delicious cake.</p>
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> KSh ${total.toLocaleString()}</p>
          <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
          <p>We'll send you updates as we prepare your order.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}" class="button">
              Track Your Order
            </a>
          </p>
        </div>
        <div class="footer">
          <p>If you have any questions, reply to this email or contact us.</p>
          <p>&copy; 2025 Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function orderStatusEmail(orderNumber: string, customerName: string, status: string) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: 'Your order has been confirmed and we\'re getting started!',
    PREPARING: 'Our bakers are hard at work preparing your cake!',
    READY: 'Your cake is ready for delivery!',
    DELIVERED: 'Your order has been delivered. Enjoy!',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF69B4; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎂 Order Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${customerName},</h2>
          <p><strong>Order ${orderNumber}</strong></p>
          <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function welcomeEmail(name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF69B4; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎂 Welcome to Cake Shop!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for joining Cake Shop! We're thrilled to have you.</p>
          <p>Start exploring our delicious collection of cakes and place your first order today.</p>
          <p>Happy baking! 🎉</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getContactEmailTemplate(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #FF69B4; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍰 New Contact Message</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            ${data.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="message-box">
              <div class="label">Message:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
              This message was sent from the Cake Shop contact form.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getCustomerConfirmationTemplate(data: {
  name: string;
  subject: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .icon { font-size: 48px; margin-bottom: 10px; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">✅</div>
            <h1>Message Received!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting Cake Shop! We've received your message regarding "<strong>${data.subject}</strong>" and our team will get back to you within 24 hours.</p>
            <p>We appreciate your interest in our delicious cakes and look forward to serving you!</p>
            <p>Best regards,<br><strong>The Cake Shop Team</strong> 🍰</p>
          </div>
          <div class="footer">
            <p>Cake Shop - Making Your Celebrations Sweeter</p>
            <p>Email: info@cakeshop.com | Phone: +254 712 345 678</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

