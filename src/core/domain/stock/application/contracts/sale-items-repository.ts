import { SaleItem } from '../../enterprise/entities/sale-item'

export interface SaleItemsRepository {
    create(saleItem: SaleItem): Promise<void>
    save(saleItem: SaleItem): Promise<void>
    delete(saleItemId: string): Promise<void>
    findManyBySaleId(saleId: string): Promise<SaleItem[]>
    deleteManyBySaleId(saleId: string): Promise<void>
}
