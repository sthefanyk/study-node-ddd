import { AggregateRoot } from '@/core/shared/entities/aggregate-root'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'
import { SaleItemsList } from './sale-items-list'
import { ValidationError } from '@/core/shared/errors/validation-error'

export interface SaleProps {
    dateOfSale?: Date
    saleItems: SaleItemsList
}

export class Sale extends AggregateRoot<SaleProps> {
    get dateOfSale() {
        return this.props.dateOfSale
    }

    get saleItems() {
        return this.props.saleItems
    }

    set saleItems(saleItems: SaleItemsList) {
        if (saleItems.currentItems.length === 0) {
            throw new ValidationError()
        }

        this.props.saleItems = saleItems
    }

    static create(
        props: Optional<SaleProps, 'dateOfSale' | 'saleItems'>,
        id?: UniqueEntityID,
    ) {
        const sale = new Sale(
            {
                ...props,
                dateOfSale: new Date(),
                saleItems: props.saleItems ?? new SaleItemsList(),
            },
            id,
        )

        return sale
    }
}
