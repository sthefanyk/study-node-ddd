import { Entity } from '@/core/shared/entities/entity'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { ValidationError } from '../error/validation-error'

export interface SaleItemProps {
    productId: UniqueEntityID
    saleId: UniqueEntityID
    quantity: number
    priceProductTimeOfSale: number
}

export class SaleItem extends Entity<SaleItemProps> {
    get productId() {
        return this.props.productId
    }

    get saleId() {
        return this.props.saleId
    }

    get quantity() {
        return this.props.quantity
    }

    get priceProductTimeOfSale() {
        return this.props.priceProductTimeOfSale
    }

    get profitFromSale() {
        return this.props.priceProductTimeOfSale * this.props.quantity
    }

    static create(props: SaleItemProps, id?: UniqueEntityID) {
        if (props.quantity < 1 || props.priceProductTimeOfSale <= 0) {
            throw new ValidationError()
        }

        const sale = new SaleItem(props, id)

        return sale
    }
}
