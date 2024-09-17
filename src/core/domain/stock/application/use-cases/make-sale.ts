import { Sale } from '../../enterprise/entities/sale'
import { ProductRepository } from '../contracts/product-repository'
import { SaleRepository } from '../contracts/sale-repository'
import { Either, left, right } from '@/core/shared/errors/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { SaleItem } from '../../enterprise/entities/sale-item'
import { SaleItemsList } from '../../enterprise/entities/sale-items-list'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { ValidationError } from '../../enterprise/error/validation-error'

export interface SaleItemInput {
    productId: string
    quantity: number
}

interface MakeSaleInput {
    saleId?: string
    saleItems: SaleItemInput[]
}

type MakeSaleOutput = Either<ResourceNotFoundError, { sale: Sale }>

export class MakeSaleUseCase {
    constructor(
        private saleRepository: SaleRepository,
        private productRepository: ProductRepository,
    ) {}

    async execute({
        saleId,
        saleItems,
    }: MakeSaleInput): Promise<MakeSaleOutput> {
        try {
            const sale = Sale.create({}, new UniqueEntityID(saleId))

            const saleItemsPromises = saleItems.map(async (saleItem) => {
                const product = await this.productRepository.findById(
                    saleItem.productId,
                )

                if (!product) {
                    throw new ResourceNotFoundError()
                }

                return SaleItem.create({
                    saleId: sale.id,
                    productId: product.id,
                    priceProductTimeOfSale: product.price,
                    quantity: saleItem.quantity,
                })
            })

            const resolvedSaleItems = await Promise.all(saleItemsPromises)

            sale.saleItems = new SaleItemsList(resolvedSaleItems)

            await this.saleRepository.create(sale)

            return right({ sale })
        } catch (error) {
            if (
                error instanceof ResourceNotFoundError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
