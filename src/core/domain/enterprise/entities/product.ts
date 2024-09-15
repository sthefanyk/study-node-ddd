import { Entity } from '@/core/shared/entities/entity'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'

export interface ProductProps {
    name: string
    price: number
    quantity: number
    minimumQuantity: number
}

export class Product extends Entity<ProductProps> {
    get minimumQuantity(): number {
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
