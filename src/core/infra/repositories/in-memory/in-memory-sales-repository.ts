import { SaleRepository } from '@/core/domain/application/contracts/sale-repository'
import { Sale } from '@/core/domain/enterprise/entities/sale'

export class InMemorySaleRepository implements SaleRepository {
    public sales: Sale[] = []

    async create(sale: Sale): Promise<void> {
        await this.sales.push(sale)
    }

    async save(sale: Sale): Promise<void> {
        const saleIndex = this.sales.findIndex(
            (item) => item.id.toString() === sale.id.toString(),
        )

        this.sales[saleIndex] = sale
    }

    async findById(id: string): Promise<Sale | null> {
        return this.sales.find((sale) => sale.id.toString() === id) || null
    }
}
