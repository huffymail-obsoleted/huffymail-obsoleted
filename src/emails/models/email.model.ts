import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'emails',
  underscored: true,
  indexes: [
    { fields: ['to'] }
  ]
})
export class Email extends Model {
  @Column({ unique: true })
    messageId: string

  @Column
    from: string

  @Column
    to: string

  @Column
    spamVerdict: boolean

  @Column
    virusVerdict: boolean

  @Column({ type: DataType.TEXT })
    subject: string

  @Column({ type: DataType.TEXT })
    html: string
}
