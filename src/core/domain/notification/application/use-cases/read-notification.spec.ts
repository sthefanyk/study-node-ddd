import { InMemoryNotificationsRepository } from '@/core/infra/repositories/in-memory/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { TestContext } from 'vitest'
import { makeNotification } from '@/core/test/factory/make-notification'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { NotAllowedError } from '@/core/shared/errors/not-allowed-error'

interface TestContextWithSut extends TestContext {
    inMemoryNotificationsRepository: InMemoryNotificationsRepository
    sut: ReadNotificationUseCase
}

describe('Send Notification', () => {
    beforeEach((context: TestContextWithSut) => {
        context.inMemoryNotificationsRepository =
            new InMemoryNotificationsRepository()
        context.sut = new ReadNotificationUseCase(
            context.inMemoryNotificationsRepository,
        )
    })

    it('should be able to read a notification', async ({
        sut,
        inMemoryNotificationsRepository,
    }: TestContextWithSut) => {
        const notification = makeNotification()

        inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
            expect.any(Date),
        )
    })

    it('should not be able to read a notification from another user', async ({
        sut,
        inMemoryNotificationsRepository,
    }: TestContextWithSut) => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('recipient-1'),
        })

        inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
