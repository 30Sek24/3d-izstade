import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import * as leadsController from '../controllers/leadsController.js';
import * as agentsController from '../controllers/agentsController.js';
import * as marketplaceController from '../controllers/marketplaceController.js';
import * as outreachController from '../controllers/outreachController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';

export const router = Router();

// Apply global rate limiting to all API routes
router.use(rateLimitMiddleware);

/**
 * PUBLIC ROUTES (e.g. for landing pages or unauthenticated data)
 * (None specified in requirements, but placeholder for scalability)
 */

/**
 * PROTECTED ROUTES (Require Supabase JWT)
 */
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);

// Leads
router.get('/leads', authMiddleware, leadsController.getLeads);
router.post('/leads/generate', authMiddleware, leadsController.generateLeads);
router.post('/leads/capture', leadsController.captureLead); // Public endpoint for LPs

// Agents
router.post('/agents/run', agentsController.runAgentTask);

// Marketplace
router.get('/marketplace/agents', marketplaceController.getMarketplaceAgents);
router.post('/marketplace/install', marketplaceController.installAgent);

// Outreach
router.post('/outreach/email', outreachController.sendEmail);
