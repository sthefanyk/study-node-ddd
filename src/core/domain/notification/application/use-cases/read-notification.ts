import { Either, left, right } from '@/core/shared/errors/contracts/either'
import { NotificationsRepository } from '../contracts/notifications-repository'
import { ResourceNotFoundError } from '@/core/shared/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/shared/errors/not-allowed-error'
import { Notification } from '../../enterprise/entities/notification'

interface ReadNotificationUseCaseRequest {
    recipientId: string
    notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        notification: Notification
    }
>

export class ReadNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
        recipientId,
        notificationId,
    }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
        const notification =
            await this.notificationsRepository.findById(notificationId)

        if (!notification) {
            return left(new ResourceNotFoundError())
        }

        if (recipientId !== notification.recipientId.toString()) {
            return left(new NotAllowedError())
        }

        notification.read()

        await this.notificationsRepository.save(notification)

        return right({ notification })
    }
}
