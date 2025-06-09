// SMS notification service for subscription events
interface NotificationEvent {
  type: 'subscription_created' | 'license_purchased' | 'payment_failed' | 'lead_captured';
  data: any;
  recipientPhone?: string;
  recipientEmail?: string;
}

class NotificationService {
  private twilioClient: any = null;

  constructor() {
    // Initialize Twilio only if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        console.log('📱 Twilio SMS service initialized');
      } catch (error) {
        console.warn('⚠️ Twilio initialization failed:', error.message);
      }
    } else {
      console.log('📱 Twilio credentials not configured - SMS notifications disabled');
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('📱 SMS disabled - would send:', { to, message });
      return false;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      console.log(`📱 SMS sent successfully: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('📱 SMS send failed:', error.message);
      return false;
    }
  }

  async sendSubscriptionAlert(event: NotificationEvent): Promise<void> {
    const adminPhone = '+12143434040'; // Your Fort Worth number
    
    let message = '';
    
    switch (event.type) {
      case 'subscription_created':
        message = `🎯 New DWC Systems subscription: ${event.data.planId} - $${event.data.amount}/month. Client: ${event.data.customerEmail || 'Unknown'}`;
        break;
      case 'license_purchased':
        message = `💰 License purchased: ${event.data.licenseType} - $${event.data.amount}. License: ${event.data.licenseId}`;
        break;
      case 'payment_failed':
        message = `⚠️ Payment failed for ${event.data.customerEmail}. Amount: $${event.data.amount}. Reason: ${event.data.reason}`;
        break;
      case 'lead_captured':
        message = `🎯 High-value lead: ${event.data.company} (${event.data.location}) - $${event.data.estimatedValue?.toLocaleString()} opportunity`;
        break;
      default:
        message = `📊 DWC Systems notification: ${JSON.stringify(event.data)}`;
    }

    // Send to admin
    await this.sendSMS(adminPhone, message);
    
    // Log for dashboard
    console.log(`🔔 Notification sent: ${event.type}`, event.data);
  }

  async sendCustomerConfirmation(event: NotificationEvent): Promise<void> {
    if (!event.recipientPhone) return;

    let message = '';
    
    switch (event.type) {
      case 'subscription_created':
        message = `Welcome to DWC Systems! Your ${event.data.planId} subscription is active. Support: support@dwcsystems.com`;
        break;
      case 'license_purchased':
        message = `Your DWC Systems license is ready! Download link sent to email. License: ${event.data.licenseId}`;
        break;
    }

    if (message) {
      await this.sendSMS(event.recipientPhone, message);
    }
  }
}

export const notificationService = new NotificationService();