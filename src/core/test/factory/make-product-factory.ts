import {
    Product,
    ProductProps,
} from '@/core/domain/enterprise/entities/product'

export function makeProductFactory(override: Partial<ProductProps> = {}) {
    const product = Product.create({
        name: 'computador',
        price: 20,
        quantityInStock: 1000,
        ...override,
    })

    return product
}
