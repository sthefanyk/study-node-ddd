import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
    private value: string

    public toValue(): string {
        return this.value
    }

    public toString(): string {
        return this.value
    }

    constructor(value?: string) {
        this.value = value ?? randomUUID()
    }
}
