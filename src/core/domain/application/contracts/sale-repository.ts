import { Sale } from '../../enterprise/entities/sale'

export interface SaleRepository {
    create(sale: Sale): Promise<void>
    save(sale: Sale): Promise<void>
    findById(id: string): Promise<Sale | null>
    delete(sale: Sale): Promise<void>
}
