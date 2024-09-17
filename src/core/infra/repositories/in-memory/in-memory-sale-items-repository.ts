import { SaleItemsRepository } from '@/core/domain/stock/application/contracts/sale-items-repository'
import { SaleItem } from '@/core/domain/stock/enterprise/entities/sale-item'

export class InMemorySaleItemsRepository implements SaleItemsRepository {
    public items: SaleItem[] = []

    async create(saleItem: SaleItem): Promise<void> {
        this.items.push(saleItem)
    }

    async save(saleItem: SaleItem): Promise<void> {
        const saleItemIndex = this.items.findIndex(
            (item) => item.id.toString() === saleItem.id.toString(),
        )

        this.items[saleItemIndex] = saleItem
    }

    async findManyBySaleId(saleId: string): Promise<SaleItem[]> {
        const saleItems = this.items.filter(
            (item) => item.saleId.toString() === saleId,
        )

        return saleItems
    }

    async deleteManyBySaleId(saleId: string): Promise<void> {
        const saleItems = this.items.filter(
            (item) => item.saleId.toString() !== saleId,
        )

        this.items = saleItems
    }

    async delete(saleItemId: string): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.id.toString() === saleItemId,
        )

        this.items.splice(itemIndex, 1)
    }
}
