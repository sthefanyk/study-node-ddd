import { UseCaseError } from '@/core/shared/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
    constructor() {
        super('Resource not found')
    }
}
