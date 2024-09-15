import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { SetMinimumQuantityUseCase } from './set-minimum-quantity'
import { CreateProductUseCase } from './create-product'
import { TestContext } from 'vitest'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    createProductUseCase: CreateProductUseCase
    sut: SetMinimumQuantityUseCase
}

describe('Set minimum quantity', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.createProductUseCase = new CreateProductUseCase(
            context.productsRepository,
        )
        context.sut = new SetMinimumQuantityUseCase(context.productsRepository)
    })

    it('should be able set minimum quantity', async ({
        sut,
        createProductUseCase,
        productsRepository,
    }: TestContextWithSut) => {
        const { product } = await createProductUseCase.execute({
            name: 'computador',
            price: 20,
            quantity: 1000,
        })

        const result = await sut.execute({
            minimumQuantity: 50,
            productId: product.id.toValue(),
        })

        expect(result.product.minimumQuantity).toEqual(50)
        expect(productsRepository.products[0].minimumQuantity).toEqual(50)
    })
})
