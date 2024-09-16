import { Sale } from '../../enterprise/entities/sale'
import { ProductRepository } from '../contracts/product-repository'
import { SaleRepository } from '../contracts/sale-repository'
import { Either, left, right } from '@/core/shared/errors/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { SaleItem } from '../../enterprise/entities/sale-item'
import { SaleItemsList } from '../../enterprise/entities/sale-items-list'

export interface SaleItemInput {
    productId: string
    quantity: number
}

interface MakeSaleInput {
    saleItems: SaleItemInput[]
}

type MakeSaleOutput = Either<ResourceNotFoundError, { sale: Sale }>

export class MakeSaleUseCase {
    constructor(
        private saleRepository: SaleRepository,
        private productRepository: ProductRepository,
    ) {}

    async execute({ saleItems }: MakeSaleInput): Promise<MakeSaleOutput> {
        const sale = Sale.create({})

        try {
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
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
