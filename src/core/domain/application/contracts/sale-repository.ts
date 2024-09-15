import { Sale } from '../../enterprise/entities/sale'

export interface SaleRepository {
    create(Sale: Sale): Promise<void>
    save(Sale: Sale): Promise<void>
    findById(id: string): Promise<Sale | null>
}
