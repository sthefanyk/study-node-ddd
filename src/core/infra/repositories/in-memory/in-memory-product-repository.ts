import { ProductRepository } from '@/core/domain/stock/application/contracts/product-repository'
import { Product } from '@/core/domain/stock/enterprise/entities/product'
import { DomainEvents } from '@/core/shared/events/domain-events'

export class InMemoryProductRepository implements ProductRepository {
    public products: Product[] = []

    async create(product: Product): Promise<void> {
        await this.products.push(product)

        DomainEvents.dispatchEventsForAggregate(product.id)
    }

    async save(product: Product): Promise<void> {
        const productIndex = this.products.findIndex(
            (item) => item.id.toString() === product.id.toString(),
        )

        this.products[productIndex] = product
    }

    async findById(id: string): Promise<Product | null> {
        return (
            this.products.find((product) => product.id.toString() === id) ||
            null
        )
    }
}
