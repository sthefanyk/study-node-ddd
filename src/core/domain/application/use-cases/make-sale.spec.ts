import { InMemorySaleRepository } from '@/core/infra/repositories/in-memory/in-memory-sales-repository'
import { MakeSaleUseCase } from './make-sale'
import { TestContext } from 'vitest'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    salesRepository: InMemorySaleRepository
    sut: MakeSaleUseCase
}

describe('Create sale', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.salesRepository = new InMemorySaleRepository()

        context.sut = new MakeSaleUseCase(
            context.salesRepository,
            context.productsRepository,
        )
    })

    it('should be able to make sale', async ({
        sut,
        productsRepository,
        salesRepository,
    }: TestContextWithSut) => {
        const product = makeProductFactory()
        await productsRepository.create(product)

        const { sale } = await sut.execute({
            productId: product.id.toString(),
            quantity: 10,
        })

        expect(sale.id.toString()).toEqual(expect.any(String))
        expect(salesRepository.sales).length(1)
    })
})
