import { faker } from '@faker-js/faker'

import {
    Product,
    ProductProps,
} from '@/core/domain/enterprise/entities/product'

export function makeProductFactory(override: Partial<ProductProps> = {}) {
    const product = Product.create({
        name: faker.word.noun(),
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
    })

    return product
}
