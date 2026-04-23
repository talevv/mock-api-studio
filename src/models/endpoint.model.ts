import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Endpoint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column('text')
  body: string;

  @Column({ default: false })
  active: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
