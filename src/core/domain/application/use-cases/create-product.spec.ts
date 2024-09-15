import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { CreateProductUseCase } from './create-product'

describe('Create product', () => {
    it('should be able create product', async () => {
        const repository = new InMemoryProductRepository()
        const usecase = new CreateProductUseCase(repository)

        const { product } = await usecase.execute({
            name: 'computador',
            price: 20,
            quantity: 1000,
        })

        expect(product.id.toString()).toEqual(expect.any(String))
        expect(repository.products).length(1)
    })
})
