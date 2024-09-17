import { faker } from '@faker-js/faker'

import {
    Product,
    ProductProps,
} from '@/core/domain/stock/enterprise/entities/product'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'

export function makeProductFactory(
    override: Partial<ProductProps> = {},
    id?: UniqueEntityID,
) {
    const product = Product.create(
        {
            name: faker.commerce.product(),
            price: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.02,
            }),
            quantityInStock: faker.number.int({
                min: 100,
                max: 1000,
            }),
            ...override,
        },
        id,
    )

    return product
}
