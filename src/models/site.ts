import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core'

export interface ISite {
  name: string
  latitude: number
  longitude: number
}

@Entity({ tableName: 'site' })
export class Site extends BaseEntity<Site, 'id'> implements ISite {
  @PrimaryKey()
  id: number

  @Property()
  name!: string

  @Property()
  latitude: number
  
  @Property()
  longitude: number
}
