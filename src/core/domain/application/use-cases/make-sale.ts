import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Sale } from '../../enterprise/entities/sale'
import { ProductRepository } from '../contracts/product-repository'
import { SaleRepository } from '../contracts/sale-repository'

interface MakeSaleInput {
    productId: string
    quantity: number
}

interface MakeSaleOutput {
    sale: Sale
}

export class MakeSaleUseCase {
    constructor(
        private saleRepository: SaleRepository,
        private productRepository: ProductRepository,
    ) {}

    async execute({
        productId,
        quantity,
    }: MakeSaleInput): Promise<MakeSaleOutput> {
        const product = await this.productRepository.findById(productId)

        if (!product) {
            throw new Error()
        }

        const sale = Sale.create({
            productId: product.id,
            quantity,
            priceProductTimeOfSale: product.price,
        })

        await this.saleRepository.create(sale)

        return { sale }
    }
}
