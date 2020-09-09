export interface INotifier<T> {
  sendNotifications(notifications: T[]): Promise<any>;
}
