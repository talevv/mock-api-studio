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

  @Column({default: 200})
  status: number;

  @Column('text')
  body: string;

  @Column({default: 0})
  delay: number;

  @Column({ default: false })
  active: boolean;

  @Column('text', { nullable: true })
  headers: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
