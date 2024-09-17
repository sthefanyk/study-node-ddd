import { NotificationsRepository } from '@/core/domain/notification/application/contracts/notifications-repository'
import { Notification } from '@/core/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
    implements NotificationsRepository
{
    public items: Notification[] = []

    async create(notification: Notification) {
        this.items.push(notification)
    }

    async findById(notificationId: string): Promise<Notification | null> {
        const notification = this.items.find(
            (item) => item.id.toString() === notificationId,
        )

        if (!notification) {
            return null
        }

        return notification
    }

    async save(notification: Notification): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.id === notification.id,
        )

        this.items[itemIndex] = notification
    }
}
