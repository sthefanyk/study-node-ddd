import { InMemorySaleRepository } from '@/core/infra/repositories/in-memory/in-memory-sales-repository'
import { MakeSaleUseCase, SaleItemInput } from './make-sale'
import { TestContext } from 'vitest'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'
import { ValidationError } from '../../enterprise/error/validation-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

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
        const numberOfItems = 5

        for (let i = 1; i <= numberOfItems; i++) {
            const product = makeProductFactory()
            await productsRepository.create(product)
        }

        const saleItems: SaleItemInput[] = productsRepository.products.map(
            (product) => {
                const saleItem: SaleItemInput = {
                    productId: product.id.toString(),
                    quantity: 10,
                }

                return saleItem
            },
        )

        const result = await sut.execute({
            saleItems,
        })

        expect(result.isRight()).toBe(true)
        expect(salesRepository.sales).length(1)
        expect(salesRepository.sales[0].saleItems.currentItems).toHaveLength(
            numberOfItems,
        )
    })

    it('should return an error if product does not exist', async ({
        sut,
    }: TestContextWithSut) => {
        const saleItems: SaleItemInput[] = [
            { productId: 'non-existing-product-id', quantity: 10 },
        ]

        const result = await sut.execute({
            saleItems,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should return an error if it has no saleItems', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            saleItems: [],
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
    })
})
