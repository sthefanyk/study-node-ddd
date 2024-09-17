import { InMemorySaleRepository } from '@/core/infra/repositories/in-memory/in-memory-sales-repository'
import { TestContext } from 'vitest'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { SaleItemsList } from '../../enterprise/entities/sale-items-list'
import { EditSaleUseCase } from './edit-sale'
import { makeSaleFactory } from '@/core/test/factory/make-sale-factory'
import { makeSaleItemFactory } from '@/core/test/factory/make-sale-items-factory'
import { InMemorySaleItemsRepository } from '@/core/infra/repositories/in-memory/in-memory-sale-items-repository'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    productsRepository: InMemoryProductRepository
    salesRepository: InMemorySaleRepository
    saleItemsRepository: InMemorySaleItemsRepository
    sut: EditSaleUseCase
}

describe('Edit sale', () => {
    beforeEach((context: TestContextWithSut) => {
        context.productsRepository = new InMemoryProductRepository()
        context.salesRepository = new InMemorySaleRepository()
        context.saleItemsRepository = new InMemorySaleItemsRepository()

        context.sut = new EditSaleUseCase(
            context.salesRepository,
            context.saleItemsRepository,
            context.productsRepository,
        )
    })

    it('should be able to edit an existing sale', async ({
        sut,
        salesRepository,
        productsRepository,
    }: TestContextWithSut) => {
        const numberOfItems = 5

        for (let i = 1; i <= numberOfItems; i++) {
            const product = makeProductFactory(
                {},
                new UniqueEntityID(`product-${i}`),
            )
            await productsRepository.create(product)
        }

        const sale = makeSaleFactory(
            {
                saleItems: new SaleItemsList([
                    makeSaleItemFactory(
                        {
                            saleId: new UniqueEntityID('sale-1'),
                            productId: new UniqueEntityID('product-1'),
                            quantity: 50,
                        },
                        new UniqueEntityID('sale-item-1'),
                    ),
                    makeSaleItemFactory(
                        {
                            saleId: new UniqueEntityID('sale-1'),
                            productId: new UniqueEntityID('product-2'),
                        },
                        new UniqueEntityID('sale-item-2'),
                    ),
                    makeSaleItemFactory(
                        {
                            saleId: new UniqueEntityID('sale-1'),
                            productId: new UniqueEntityID('product-3'),
                        },
                        new UniqueEntityID('sale-item-3'),
                    ),
                ]),
            },
            new UniqueEntityID('sale-1'),
        )

        salesRepository.sales.push(sale)

        const result = await sut.execute({
            saleId: sale.id.toString(),
            saleItems: [
                { productId: 'product-1', quantity: 80 },
                { productId: 'product-3', quantity: 100 },
                { productId: 'product-5', quantity: 100 },
            ],
        })

        const updatedSale = salesRepository.sales[0].saleItems.currentItems
        expect(result.isRight()).toBe(true)
        expect(updatedSale).toHaveLength(3)
        expect(updatedSale[0].productId.toString()).toBe('product-1')
        expect(updatedSale[1].productId.toString()).toBe('product-3')
        expect(updatedSale[2].productId.toString()).toBe('product-5')
        expect(updatedSale[0].quantity).toBe(80)
    })

    it('should return an error if sale does not exist', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            saleId: 'non-existing-sale-id',
            saleItems: [{ productId: 'product-1', quantity: 10 }],
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})
