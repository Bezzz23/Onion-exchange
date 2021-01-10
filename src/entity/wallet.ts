import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Length, IsNumber } from 'class-validator';
import { Currency } from './currency';
// import { currency } from 'src/controller';
@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column('boolean', { default: false })
  archived: boolean;

  @Column({
    length: 100
  })

  // @ManyToOne(() => Currency, currency => currency.token)
  // @JoinColumn()
  @Column()
  currency: string

  @Column('float', { default: 0 })
  balance: number;
}

export const walletSchema = {
  id: { type: 'number', required: true, example: 1 },
  address: { type: 'string', required: true, example: '0xaae47eae4ddd4877e0ae0bc780cfaee3cc3b52cb' },
  currency: { type: 'string', required: true, example: 1 },
  balance: { type: 'number', required: false, example: 8 }
};