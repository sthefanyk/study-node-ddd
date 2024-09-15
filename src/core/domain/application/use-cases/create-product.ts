import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../contracts/product-repository'

type CreateProductUseCaseInput = {
    id?: string
    name: string
    price: number
    quantityInStock: number
    minimumQuantity?: number
}

interface CreateProductUseCaseOutput {
    product: Product
}

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
        name,
        price,
        quantityInStock,
        minimumQuantity,
    }: CreateProductUseCaseInput): Promise<CreateProductUseCaseOutput> {
        const product = Product.create(
            {
                name,
                price,
                minimumQuantity,
                quantityInStock,
            },
            new UniqueEntityID(id),
        )

        await this.productRepository.create(product)

        return { product }
    }
}
