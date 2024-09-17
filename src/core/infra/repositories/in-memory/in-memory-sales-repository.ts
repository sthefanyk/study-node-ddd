import { SaleItemsRepository } from '@/core/domain/stock/application/contracts/sale-items-repository'
import { SaleRepository } from '@/core/domain/stock/application/contracts/sale-repository'
import { Sale } from '@/core/domain/stock/enterprise/entities/sale'

export class InMemorySaleRepository implements SaleRepository {
    public sales: Sale[] = []

    constructor(private saleItemsRepository: SaleItemsRepository) {}

    async create(sale: Sale): Promise<void> {
        sale.saleItems.currentItems.map(async (item) => {
            await this.saleItemsRepository.create(item)
        })
        this.sales.push(sale)
    }

    async save(sale: Sale): Promise<void> {
        sale.saleItems.getRemovedItems().map(async (removedItem) => {
            this.saleItemsRepository.delete(removedItem.id.toString())
        })

        sale.saleItems.getNewItems().map(async (newItem) => {
            this.saleItemsRepository.create(newItem)
        })

        const saleIndex = this.sales.findIndex(
            (item) => item.id.toString() === sale.id.toString(),
        )

        this.sales[saleIndex] = sale
    }

    async findById(id: string): Promise<Sale | null> {
        return this.sales.find((sale) => sale.id.toString() === id) || null
    }

    async delete(sale: Sale): Promise<void> {
        const itemIndex = this.sales.findIndex((item) => item.id === sale.id)

        this.sales.splice(itemIndex, 1)

        this.saleItemsRepository.deleteManyBySaleId(sale.id.toString())
    }
}
