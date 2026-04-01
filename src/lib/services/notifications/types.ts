export interface NotificationContext {
  userId: string;
  email?: string;
  phone?: string;
  couponCode: string;
  groupTitle: string;
  validTo: Date;
}

export interface INotificationStrategy {
  send(context: NotificationContext): Promise<boolean>;
}
