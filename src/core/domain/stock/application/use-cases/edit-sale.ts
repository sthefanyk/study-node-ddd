import { Either, left, right } from '@/core/shared/errors/either'
import { ProductRepository } from '../contracts/product-repository'
import { SaleRepository } from '../contracts/sale-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Sale } from '../../enterprise/entities/sale'
import { SaleItem } from '../../enterprise/entities/sale-item'
import { SaleItemsRepository } from '../contracts/sale-items-repository'
import { SaleItemsList } from '../../enterprise/entities/sale-items-list'
import { ValidationError } from '../../enterprise/error/validation-error'

export interface EditSaleItemInput {
    productId: string
    quantity: number
}

interface EditSaleInput {
    saleId: string
    saleItems: EditSaleItemInput[]
}

type EditSaleOutput = Either<
    ResourceNotFoundError | ValidationError,
    { sale: Sale }
>

export class EditSaleUseCase {
    constructor(
        private saleRepository: SaleRepository,
        private saleItemsRepository: SaleItemsRepository,
        private productRepository: ProductRepository,
    ) {}

    async execute({
        saleId,
        saleItems,
    }: EditSaleInput): Promise<EditSaleOutput> {
        try {
            const sale = await this.saleRepository.findById(saleId)

            if (!sale) {
                return left(new ResourceNotFoundError())
            }

            const currentSaleItems =
                await this.saleItemsRepository.findManyBySaleId(saleId)

            const saleItemsList = new SaleItemsList(currentSaleItems)

            const newSaleItemsPromises = saleItems.map(async (saleItem) => {
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

            const resolvedNewSaleItems = await Promise.all(newSaleItemsPromises)

            saleItemsList.update(resolvedNewSaleItems)

            sale.saleItems = saleItemsList

            await this.saleRepository.save(sale)

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
