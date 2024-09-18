import { AggregateRoot } from '@/core/shared/entities/aggregate-root'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'
import { StockNearingEndEvent } from '../events/stock-nearing-end-event'

export interface ProductProps {
    name: string
    price: number
    quantityInStock: number
    minimumQuantity: number
}

export class Product extends AggregateRoot<ProductProps> {
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

    reduceStock(amount: number) {
        if (amount > this.props.quantityInStock) {
            throw new Error('Quantidade insuficiente em estoque')
        }

        this.props.quantityInStock -= amount

        if (this.props.quantityInStock <= this.props.minimumQuantity) {
            this.addDomainEvent(new StockNearingEndEvent(this))
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

        const isNewProduct = !id

        if (isNewProduct) {
            product.addDomainEvent(new StockNearingEndEvent(product))
        }

        return product
    }
}
