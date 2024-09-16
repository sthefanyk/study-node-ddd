import { InMemoryProductRepository } from '@/core/infra/repositories/in-memory/in-memory-product-repository'
import { CreateProductUseCase } from './create-product'

describe('Create product', () => {
    it('should be able to create product', async () => {
        const repository = new InMemoryProductRepository()
        const usecase = new CreateProductUseCase(repository)

        const result = await usecase.execute({
            name: 'computador',
            price: 20,
            quantityInStock: 1000,
        })

        expect(result.isRight()).toBe(true)
        expect(repository.products).length(1)
    })
})
