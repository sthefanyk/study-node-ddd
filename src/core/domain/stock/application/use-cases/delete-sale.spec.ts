import { InMemorySaleRepository } from '@/core/infra/repositories/in-memory/in-memory-sales-repository'
import { TestContext } from 'vitest'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { SaleItemsList } from '../../enterprise/entities/sale-items-list'
import { makeSaleFactory } from '@/core/test/factory/make-sale-factory'
import { makeSaleItemFactory } from '@/core/test/factory/make-sale-items-factory'
import { InMemorySaleItemsRepository } from '@/core/infra/repositories/in-memory/in-memory-sale-items-repository'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'
import { DeleteSaleUseCase } from './delete-sale'
import { ResourceNotFoundError } from '@/core/shared/errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    salesRepository: InMemorySaleRepository
    saleItemsRepository: InMemorySaleItemsRepository
    sut: DeleteSaleUseCase
}

describe('DeleteSaleUseCase', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.saleItemsRepository = new InMemorySaleItemsRepository()
        context.salesRepository = new InMemorySaleRepository(
            context.saleItemsRepository,
        )

        context.sut = new DeleteSaleUseCase(context.salesRepository)
    })

    it('should delete an existing sale and its associated sale items', async ({
        sut,
        salesRepository,
        productsRepository,
        saleItemsRepository,
    }: TestContextWithSut) => {
        const product = makeProductFactory({}, new UniqueEntityID(`product-1`))
        await productsRepository.create(product)

        const sale = makeSaleFactory(
            {
                saleItems: new SaleItemsList([
                    makeSaleItemFactory({
                        productId: new UniqueEntityID('product-1'),
                        quantity: 50,
                    }),
                ]),
            },
            new UniqueEntityID('sale-1'),
        )

        salesRepository.sales.push(sale)

        const result = await sut.execute({
            saleId: sale.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(salesRepository.sales).toHaveLength(0)
        expect(saleItemsRepository.items).toHaveLength(0)
    })

    it('should return a ResourceNotFoundError if sale does not exist', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            saleId: 'non-existing-sale-id',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})
