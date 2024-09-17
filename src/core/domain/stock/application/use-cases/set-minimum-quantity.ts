import { Either, left, right } from '@/core/shared/errors/contracts/either'
import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../contracts/product-repository'
import { ResourceNotFoundError } from '@/core/shared/errors/resource-not-found-error'

interface SetMinimumQuantityUseCaseInput {
    productId: string
    minimumQuantity: number
}

type SetMinimumQuantityUseCaseOutput = Either<
    ResourceNotFoundError,
    {
        product: Product
    }
>

export class SetMinimumQuantityUseCase {
    constructor(private productRepository: ProductRepository) {}
    async execute({
        productId,
        minimumQuantity,
    }: SetMinimumQuantityUseCaseInput): Promise<SetMinimumQuantityUseCaseOutput> {
        const product = await this.productRepository.findById(productId)
        if (!product) return left(new ResourceNotFoundError())

        product.minimumQuantity = minimumQuantity

        await this.productRepository.save(product)

        return right({ product })
    }
}
