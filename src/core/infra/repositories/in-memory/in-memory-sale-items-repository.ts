import { SaleItemsRepository } from '@/core/domain/application/contracts/sale-items-repository'
import { SaleItem } from '@/core/domain/enterprise/entities/sale-item'

export class InMemorySaleItemsRepository implements SaleItemsRepository {
    public items: SaleItem[] = []

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
}
