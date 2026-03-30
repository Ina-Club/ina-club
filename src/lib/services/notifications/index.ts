import { clerkClient } from '@clerk/nextjs/server';
import { INotificationStrategy, NotificationContext } from './types';
import { EmailNotificationStrategy } from './emailStrategy';

export class NotificationService {
  private strategies: INotificationStrategy[] = [];

  constructor() {
    this.addStrategy(new EmailNotificationStrategy());
  }

  addStrategy(strategy: INotificationStrategy) {
    this.strategies.push(strategy);
  }

  async notifyAll(contexts: Omit<NotificationContext, 'email' | 'phone'>[]) {
    if (!contexts || contexts.length === 0) return;

    const userIds = [...new Set(contexts.map(c => c.userId))];

    let usersMap = new Map<string, { email?: string; phone?: string }>();
    try {
      const client = await clerkClient();
      for (let i = 0; i < userIds.length; i += 50) {
        // Sending requests in batches of 50 to avoid rate limits
        const chunk = userIds.slice(i, i + 50);
        const response = await client.users.getUserList({ userId: chunk });
        
        // Handle both older v4 (which returned array) and newer v5 (which returns Object)
        const users = Array.isArray(response) ? response : response.data;
        console.log(users);
        for (const user of users) {
          const email = user.emailAddresses?.[0]?.emailAddress;
          const phone = user.phoneNumbers?.[0]?.phoneNumber;
          usersMap.set(user.id, { email, phone });
        }
      }
    } catch (e) {
      console.error("Failed to fetch user contact info from Clerk:", e);
    }

    const fullContexts: NotificationContext[] = contexts.map(c => {
      const info = usersMap.get(c.userId) || {};
      return { ...c, ...info };
    });

    const promises = [];
    for (const ctx of fullContexts) {
      for (const strategy of this.strategies) {
        promises.push(strategy.send(ctx));
      }
    }
    
    await Promise.allSettled(promises);
  }
}

// Export singleton instance for app-wide use
export const notificationService = new NotificationService();
