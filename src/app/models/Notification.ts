export interface Notification {
  id: number;
  title: string;
  message: string;
  link?: string;
  type: NotificationType;
  createdAt: Date;
  isRead: boolean;
}

export enum NotificationType {
  NewFollower = 0,
  NewComment = 1,
  ArticleMention = 2,
  NewArticleFromFollowed = 3,
  SystemNotification = 4
}
