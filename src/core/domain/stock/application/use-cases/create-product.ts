import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../contracts/product-repository'
import { Either, left, right } from '@/core/shared/errors/contracts/either'

type CreateProductUseCaseInput = {
    id?: string
    name: string
    price: number
    quantityInStock: number
    minimumQuantity?: number
}

type CreateProductUseCaseOutput = Either<
    string,
    {
        product: Product
    }
>

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
        name,
        price,
        quantityInStock,
        minimumQuantity,
    }: CreateProductUseCaseInput): Promise<CreateProductUseCaseOutput> {
        if (id) {
            const product = await this.productRepository.findById(id)
            if (!product) return left('Resources already exist.')
        }

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

        return right({ product })
    }
}
