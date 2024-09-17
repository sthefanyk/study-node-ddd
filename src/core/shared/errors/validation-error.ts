import { EntityError } from './contracts/entity-error'

export class ValidationError extends Error implements EntityError {
    constructor() {
        super('Validation error')
    }
}
