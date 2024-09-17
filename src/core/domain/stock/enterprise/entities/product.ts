import { Entity } from '@/core/shared/entities/entity'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'

export interface ProductProps {
    name: string
    price: number
    quantityInStock: number
    minimumQuantity: number
}

export class Product extends Entity<ProductProps> {
    get name() {
        return this.props.name
    }

    get quantityInStock() {
        return this.props.quantityInStock
    }

    get price() {
        return this.props.price
    }

    get minimumQuantity() {
        return this.props.minimumQuantity
    }

    set minimumQuantity(minimumQuantity: number) {
        if (minimumQuantity > 0) {
            this.props.minimumQuantity = minimumQuantity
        }
    }

    static create(
        props: Optional<ProductProps, 'minimumQuantity'>,
        id?: UniqueEntityID,
    ) {
        const product = new Product(
            {
                ...props,
                minimumQuantity: 0,
            },
            id,
        )

        return product
    }
}
