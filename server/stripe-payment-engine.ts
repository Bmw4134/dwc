/**
 * Stripe Payment Engine - Production LLC Formation Payment Processing
 * Secure payment handling for DWC Systems LLC formation services
 */

import Stripe from "stripe";
import { nexusProductionCore } from "./nexus-production-core";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required for payment processing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

interface LLCFormationPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

const LLC_PACKAGES: LLCFormationPackage[] = [
  {
    id: 'starter',
    name: 'Starter LLC Formation',
    price: 29900, // $299.00 in cents
    features: [
      'Basic LLC formation in any state',
      'EIN application assistance',
      'Operating agreement template',
      'Registered agent service (1 year)',
      'Email support'
    ],
    description: 'Essential LLC formation package for entrepreneurs'
  },
  {
    id: 'professional',
    name: 'Professional LLC Formation',
    price: 79900, // $799.00 in cents
    features: [
      'Complete LLC formation with expedited processing',
      'EIN application and tax ID setup',
      'Custom operating agreement',
      'Registered agent service (2 years)',
      'Banking resolutions and certificates',
      'Priority phone and email support',
      'Compliance calendar and reminders'
    ],
    description: 'Comprehensive LLC formation with business setup assistance'
  },
  {
    id: 'enterprise',
    name: 'Enterprise LLC Formation',
    price: 199900, // $1,999.00 in cents
    features: [
      'Full-service LLC formation with same-day processing',
      'Multi-state registration capabilities',
      'Custom operating agreement with attorney review',
      'Registered agent service (3 years)',
      'Business banking setup assistance',
      'Dedicated account manager',
      'Ongoing compliance management',
      'Legal document templates library',
      'Quarterly business consultation calls'
    ],
    description: 'Premium LLC formation with ongoing business support'
  }
];

class StripePaymentEngine {
  private stripe: Stripe;

  constructor() {
    this.stripe = stripe;
  }

  async createPaymentIntent(packageId: string, customerEmail?: string): Promise<{
    clientSecret: string;
    packageDetails: LLCFormationPackage;
  }> {
    const selectedPackage = LLC_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (!selectedPackage) {
      throw new Error(`Invalid package ID: ${packageId}`);
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: selectedPackage.price,
      currency: 'usd',
      metadata: {
        package_id: packageId,
        package_name: selectedPackage.name,
        customer_email: customerEmail || 'anonymous@dwcsystems.com',
        service_type: 'llc_formation'
      },
      description: `DWC Systems LLC Formation - ${selectedPackage.name}`,
      receipt_email: customerEmail,
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      packageDetails: selectedPackage
    };
  }

  async createSubscription(customerId: string, priceId: string): Promise<{
    subscriptionId: string;
    clientSecret: string;
  }> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret!
    };
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      name,
      metadata: {
        service: 'dwc_llc_formation',
        created_via: 'nexus_platform'
      }
    });
  }

  async getPackages(): Promise<LLCFormationPackage[]> {
    return LLC_PACKAGES;
  }

  async getPackage(packageId: string): Promise<LLCFormationPackage | null> {
    return LLC_PACKAGES.find(pkg => pkg.id === packageId) || null;
  }

  async handleWebhook(signature: string, payload: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      case 'invoice.payment_succeeded':
        await this.handleSubscriptionPayment(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('💳 Payment successful:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      package: paymentIntent.metadata.package_name,
      customer: paymentIntent.metadata.customer_email
    });

    // Trigger LLC formation process
    await this.initiateFormationProcess(paymentIntent);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.error('❌ Payment failed:', {
      id: paymentIntent.id,
      last_payment_error: paymentIntent.last_payment_error,
      customer: paymentIntent.metadata.customer_email
    });
  }

  private async handleSubscriptionPayment(invoice: Stripe.Invoice): Promise<void> {
    console.log('🔄 Subscription payment received:', {
      id: invoice.id,
      amount: invoice.amount_paid,
      customer: invoice.customer_email
    });
  }

  private async initiateFormationProcess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const packageId = paymentIntent.metadata.package_id;
    const customerEmail = paymentIntent.metadata.customer_email;
    
    // Log to production metrics
    console.log('🚀 Initiating LLC formation process:', {
      package: packageId,
      customer: customerEmail,
      amount: paymentIntent.amount / 100,
      timestamp: new Date().toISOString()
    });

    // Update production metrics with new formation
    nexusProductionCore.enablePipeline('stripe', {
      lastPayment: paymentIntent.amount / 100,
      lastCustomer: customerEmail,
      packageType: packageId
    });
  }

  async getRecentTransactions(limit: number = 10): Promise<Stripe.PaymentIntent[]> {
    const paymentIntents = await this.stripe.paymentIntents.list({
      limit,
      expand: ['data.charges']
    });

    return paymentIntents.data;
  }

  async getCustomerTransactions(customerId: string): Promise<Stripe.PaymentIntent[]> {
    const paymentIntents = await this.stripe.paymentIntents.list({
      customer: customerId,
      expand: ['data.charges']
    });

    return paymentIntents.data;
  }
}

export const stripePaymentEngine = new StripePaymentEngine();
export { LLC_PACKAGES, type LLCFormationPackage };