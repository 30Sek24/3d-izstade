import { nicheDiscovery } from '../backend/growth/nicheDiscovery.js';
import { landingGenerator } from '../backend/growth/landingGenerator.js';
import { seoEngine } from '../backend/growth/seoEngine.js';
import { trafficAutomation } from '../backend/growth/trafficAutomation.js';
import { leadCapture } from '../backend/growth/leadCapture.js';

export const GrowthAPI = {
  findProfitableNiches: nicheDiscovery.findProfitableNiches,
  generateLandingPage: landingGenerator.generateLandingPage,
  generateKeywordClusters: seoEngine.generateKeywordClusters,
  generateBlogPost: seoEngine.generateBlogPost,
  generateSocialContent: trafficAutomation.generateSocialContent,
  captureLead: leadCapture.captureLead
};
