import { Either, left, right } from '@/core/shared/errors/contracts/either'
import { SaleRepository } from '../contracts/sale-repository'
import { ResourceNotFoundError } from '@/core/shared/errors/resource-not-found-error'

interface DeleteSaleInput {
    saleId: string
}

type DeleteSaleOutput = Either<ResourceNotFoundError, null>

export class DeleteSaleUseCase {
    constructor(private saleRepository: SaleRepository) {}

    async execute({ saleId }: DeleteSaleInput): Promise<DeleteSaleOutput> {
        try {
            const sale = await this.saleRepository.findById(saleId)

            if (!sale) {
                return left(new ResourceNotFoundError())
            }

            await this.saleRepository.delete(sale)

            return right(null)
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
