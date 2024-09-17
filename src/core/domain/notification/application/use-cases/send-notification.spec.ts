import { InMemoryNotificationsRepository } from '@/core/infra/repositories/in-memory/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { TestContext } from 'vitest'

interface TestContextWithSut extends TestContext {
    inMemoryNotificationsRepository: InMemoryNotificationsRepository
    sut: SendNotificationUseCase
}

describe('Send Notification', () => {
    beforeEach((context: TestContextWithSut) => {
        context.inMemoryNotificationsRepository =
            new InMemoryNotificationsRepository()

        context.sut = new SendNotificationUseCase(
            context.inMemoryNotificationsRepository,
        )
    })

    it('should be able to send a notification', async ({
        sut,
        inMemoryNotificationsRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'Nova notificação',
            content: 'Conteúdo da notificação',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0]).toEqual(
            result.value?.notification,
        )
    })
})
