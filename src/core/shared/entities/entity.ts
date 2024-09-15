import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<T> {
    private _id: UniqueEntityID
    protected props: T

    get id() {
        return this._id
    }

    constructor(props: T, id?: UniqueEntityID) {
        this._id = id ?? new UniqueEntityID()
        this.props = props
    }
}
