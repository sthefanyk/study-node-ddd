import { Product } from '../../enterprise/entities/product'
import { ProductRepository } from '../contracts/product-repository'

interface SetMinimumQuantityUseCaseInput {
    productId: string
    minimumQuantity: number
}

interface SetMinimumQuantityUseCaseOutput {
    product: Product
}

export class SetMinimumQuantityUseCase {
    constructor(private productRepository: ProductRepository) {}
    async execute({
        productId,
        minimumQuantity,
    }: SetMinimumQuantityUseCaseInput): Promise<SetMinimumQuantityUseCaseOutput> {
        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new Error()
        }

        product.minimumQuantity = minimumQuantity

        await this.productRepository.save(product)

        return { product }
    }
}
