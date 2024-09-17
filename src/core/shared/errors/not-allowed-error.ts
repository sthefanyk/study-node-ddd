import { UseCaseError } from '@/core/shared/errors/contracts/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
    constructor() {
        super('Not Allowed')
    }
}
