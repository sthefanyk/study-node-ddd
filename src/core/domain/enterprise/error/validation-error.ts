import { EntityError } from '@/core/shared/errors/entity'

export class ValidationError extends Error implements EntityError {
    constructor() {
        super('Validation error')
    }
}
