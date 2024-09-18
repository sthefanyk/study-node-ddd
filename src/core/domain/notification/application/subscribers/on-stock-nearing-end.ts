import { StockNearingEndEvent } from '@/core/domain/stock/enterprise/events/stock-nearing-end-event'
import { DomainEvents } from '@/core/shared/events/domain-events'
import { EventHandler } from '@/core/shared/events/event-handler'

export class OnStockNearingEnd implements EventHandler {
    constructor() {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewStockNearingEndNotification.bind(this),
            StockNearingEndEvent.name,
        )
    }

    private async sendNewStockNearingEndNotification({
        product,
    }: StockNearingEndEvent) {
        console.log(product)
    }
}
