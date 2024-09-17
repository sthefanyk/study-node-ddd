import { Entity } from '@/core/shared/entities/entity'
import { UniqueEntityID } from '@/core/shared/entities/unique-entity-id'
import { Optional } from '@/core/shared/types/optional'

interface NotificationProps {
    recipientId: UniqueEntityID
    title: string
    content: string
    created_at: Date
    read?: Date
}

export class Notification extends Entity<NotificationProps> {
    get recipientId() {
        return this.props.recipientId
    }

    get title() {
        return this.props.title
    }

    get content() {
        return this.props.content
    }

    get read() {
        return this.props.read
    }

    static create(
        props: Optional<NotificationProps, 'created_at'>,
        id?: UniqueEntityID,
    ) {
        const notification = new Notification(
            {
                ...props,
                created_at: props.created_at ?? new Date(),
            },
            id,
        )

        return notification
    }
}
