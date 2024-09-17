import { Either, right } from '@/core/shared/errors/contracts/either'
import { NotificationsRepository } from '../contracts/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'

interface SendNotificationUseCaseRequest {
    recipientId: string
    title: string
    content: string
}

type SendNotificationUseCaseResponse = Either<
    null,
    {
        notification: Notification
    }
>

export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityID(recipientId),
            title,
            content,
        })

        await this.notificationsRepository.create(notification)

        return right({
            notification,
        })
    }
}
