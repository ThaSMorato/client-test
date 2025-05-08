import { v7 as uuidv7 } from 'uuid'

import { ValueObject } from '../entities/value-object'
import type { Optional } from '../helpers/optional.type'

export interface UniqueEntityIDProps {
  id: string
}

export class UniqueEntityID extends ValueObject<UniqueEntityIDProps> {
  constructor({ id }: Optional<UniqueEntityIDProps, 'id'> = {}) {
    super({
      id: id ?? uuidv7(),
    })
  }

  toString() {
    return this.props.id
  }

  public equals(valueObject: ValueObject<UniqueEntityIDProps>) {
    return (
      valueObject instanceof UniqueEntityID &&
      valueObject.toString() === this.props.id
    )
  }
}
