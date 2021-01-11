import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Currency } from './currency';
@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column('boolean', { default: false })
  archived: boolean;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn()
  currency: Currency;

  @Column('float', { default: 0 })
  balance: number;
}

export const walletSchema = {
  id: { type: 'number', required: true, example: 1 },
  address: { type: 'string', required: true, example: '0xaae47eae4ddd4877e0ae0bc780cfaee3cc3b52cb' },
  currency: { type: 'string', required: true, example: 1 },
  balance: { type: 'number', required: false, example: 8 }
};