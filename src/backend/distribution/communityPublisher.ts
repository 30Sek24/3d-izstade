import snoowrap from 'snoowrap';
import { logger } from '../logging/logger.js';

/**
 * Handles publishing to community-driven platforms like Reddit.
 */
export const communityPublisher = {
  /**
   * Publishes a post to a specific subreddit.
   */
  async publishRedditPost(params: {
    subreddit: string;
    title: string;
    text?: string;
    url?: string;
  }) {
    const { subreddit, title, text, url } = params;

    try {
      logger.info('CommunityPublisher', `Publishing to Reddit: r/${subreddit}`);

      const r = new snoowrap({
        userAgent: 'Warpala-OS/1.0',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
      });

      let submission;
      if (url) {
        submission = await r.getSubreddit(subreddit).submitLink({ title, url });
      } else {
        submission = await r.getSubreddit(subreddit).submitSelfpost({ title, text: text || '' });
      }

      return { success: true, id: submission.id };
    } catch (error) {
      logger.error('CommunityPublisher', `Failed to post to Reddit r/${subreddit}`, error);
      return { success: false, error: String(error) };
    }
  }
};
