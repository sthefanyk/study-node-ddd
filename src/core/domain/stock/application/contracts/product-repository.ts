import { Product } from '../../enterprise/entities/product'

export interface ProductRepository {
    create(product: Product): Promise<void>
    save(product: Product): Promise<void>
    findById(id: string): Promise<Product | null>
}
