import { WatchedList } from '@/core/shared/entities/watched-list'
import { SaleItem } from './sale-item'

export class SaleItemsList extends WatchedList<SaleItem> {
    compareItems(a: SaleItem, b: SaleItem): boolean {
        return a.saleId.equals(b.saleId) && a.productId.equals(b.productId)
    }
}
