import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { SetMinimumQuantityUseCase } from './set-minimum-quantity'
import { TestContext } from 'vitest'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    sut: SetMinimumQuantityUseCase
}

describe('Set minimum quantity', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.sut = new SetMinimumQuantityUseCase(context.productsRepository)
    })

    it('should be able to set minimum quantity', async ({
        sut,
        productsRepository,
    }: TestContextWithSut) => {
        const product = makeProductFactory()
        await productsRepository.create(product)

        const result = await sut.execute({
            minimumQuantity: 50,
            productId: product.id.toValue(),
        })

        expect(result.product.minimumQuantity).toEqual(50)
        expect(productsRepository.products[0].minimumQuantity).toEqual(50)
    })
})
