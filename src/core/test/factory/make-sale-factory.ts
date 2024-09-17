import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Sale, SaleProps } from '@/core/domain/stock/enterprise/entities/sale'

export function makeSaleFactory(
    override: Partial<SaleProps> = {},
    id?: UniqueEntityID,
) {
    const sale = Sale.create(
        {
            ...override,
        },
        id,
    )

    return sale
}
