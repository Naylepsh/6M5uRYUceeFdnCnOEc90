export interface INotifier<T> {
  sendNotifications(notifications: T[]): void;
}
