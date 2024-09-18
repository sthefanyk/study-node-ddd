import { CreateProductUseCase } from '@/core/domain/stock/application/use-cases/create-product'
import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { OnStockNearingEnd } from './on-stock-nearing-end'
import { makeProductFactory } from '@/core/test/factory/make-product-factory'

describe('Create product', () => {
    it('should be able to create product', async () => {
        const repository = new InMemoryProductRepository()

        const onProductCreated = await new OnStockNearingEnd()

        const product = makeProductFactory()

        repository.create(product)
    })
})
