export const PlatformEvent = {
  LEAD_CREATED: 'lead_created',
  LEAD_SCORED: 'lead_scored',
  AGENT_TASK_STARTED: 'agent_task_started',
  AGENT_TASK_COMPLETED: 'agent_task_completed',
  AGENT_FAILED: 'agent_failed',
  LANDING_CREATED: 'landing_created',
  BLOG_PUBLISHED: 'blog_published',
  TRAFFIC_GENERATED: 'traffic_generated',
  SUBSCRIPTION_CREATED: 'subscription_created',
  PAYMENT_RECEIVED: 'payment_received'
} as const;

export type PlatformEvent = typeof PlatformEvent[keyof typeof PlatformEvent];

export interface EventPayload {
  eventId: string;
  eventType: PlatformEvent;
  timestamp: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}
