import { SaleItem } from '../../enterprise/entities/sale-item'

export interface SaleItemsRepository {
    findManyBySaleId(saleId: string): Promise<SaleItem[]>
    deleteManyBySaleId(saleId: string): Promise<void>
}
