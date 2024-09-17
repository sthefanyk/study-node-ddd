import {
    SaleItem,
    SaleItemProps,
} from '@/core/domain/enterprise/entities/sale-item'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'

import { faker } from '@faker-js/faker'

export function makeSaleItemFactory(
    override: Partial<SaleItemProps> = {},
    id?: UniqueEntityID,
) {
    const saleItem = SaleItem.create(
        {
            saleId: new UniqueEntityID(),
            productId: new UniqueEntityID(),
            priceProductTimeOfSale: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.02,
            }),
            quantity: faker.number.int({
                min: 10,
                max: 50,
            }),
            ...override,
        },
        id,
    )

    return saleItem
}
