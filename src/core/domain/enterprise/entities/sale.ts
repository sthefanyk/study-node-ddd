import { Entity } from '@/core/shared/entities/entity'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'

interface SaleProps {
    quantity: number
    dateOfSale?: Date
    productId: UniqueEntityID
    priceProductTimeOfSale: number
}

export class Sale extends Entity<SaleProps> {
    get quatity() {
        return this.props.quantity
    }

    get dateOfSale() {
        return this.props.dateOfSale
    }

    get productId() {
        return this.props.productId
    }

    get priceProductTimeOfSale() {
        return this.props.priceProductTimeOfSale
    }

    get profitFromSale() {
        return this.props.priceProductTimeOfSale * this.props.quantity
    }

    static create(
        props: Optional<SaleProps, 'dateOfSale'>,
        id?: UniqueEntityID,
    ) {
        if (props.quantity < 1) {
            throw new Error()
        }

        const sale = new Sale(
            {
                ...props,
                dateOfSale: new Date(),
            },
            id,
        )

        return sale
    }
}
