// Frontend exposure for SaaS Monetization
import { planService } from '../backend/billing/plans/planService';
import { creditService } from '../backend/billing/credits/creditService';
import { paymentService } from '../backend/billing/payments/paymentService';

export const BillingAPI = {
  // Plan Management
  getPlanLimits: planService.getPlanLimits,
  getUserPlan: planService.getUserPlan,
  upgradePlan: async (userId: string, newPlan: string) => {
     // In a real flow, this initiates checkout. For quick test usage, direct upgrade.
     return await paymentService.upgradePlan(userId, newPlan);
  },

  // Credit Management
  getCreditBalance: creditService.getCreditBalance,
  buyCredits: async (userId: string, packageId: string) => {
    return await paymentService.createCheckoutSession(userId, packageId, 'credits');
  },
  
  // Checkout
  createCheckoutSession: paymentService.createCheckoutSession
};
