import { InMemorySaleRepository } from '@/core/infra/repositories/in-memory/in-memory-sales-repository'
import { MakeSaleUseCase, SaleItemInput } from './make-sale'
import { TestContext } from 'vitest'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'
import { ValidationError } from '../../enterprise/error/validation-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemorySaleItemsRepository } from '@/core/infra/repositories/in-memory/in-memory-sale-items-repository'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    salesRepository: InMemorySaleRepository
    salesItemsRepository: InMemorySaleItemsRepository
    sut: MakeSaleUseCase
}

describe('MakeSaleUseCase', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.salesItemsRepository = new InMemorySaleItemsRepository()
        context.salesRepository = new InMemorySaleRepository(
            context.salesItemsRepository,
        )

        context.sut = new MakeSaleUseCase(
            context.salesRepository,
            context.productsRepository,
        )
    })

    it('should create a new sale with valid sale items', async ({
        sut,
        productsRepository,
        salesRepository,
        salesItemsRepository,
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
        expect(salesItemsRepository.items).toHaveLength(numberOfItems)
    })

    it('should return a ResourceNotFoundError if any product in the sale does not exist', async ({
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

    it('should return a ValidationError if no sale items are provided', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            saleItems: [],
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
    })
})
