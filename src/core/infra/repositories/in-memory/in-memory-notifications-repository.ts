import { NotificationsRepository } from '@/core/domain/notification/application/contracts/notifications-repository'
import { Notification } from '@/core/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
    implements NotificationsRepository
{
    public items: Notification[] = []

    async create(notification: Notification) {
        this.items.push(notification)
    }
}
