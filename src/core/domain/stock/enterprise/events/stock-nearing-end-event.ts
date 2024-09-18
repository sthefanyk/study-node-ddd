import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { DomainEvent } from '@/core/shared/events/domain-event'
import { Product } from '../entities/product'

export class StockNearingEndEvent implements DomainEvent {
    public ocurredAt: Date
    public product: Product

    constructor(product: Product) {
        this.product = product
        this.ocurredAt = new Date()
    }

    getAggregateId(): UniqueEntityID {
        return this.product.id
    }
}
