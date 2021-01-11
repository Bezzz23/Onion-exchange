import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { Currency } from './currency';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn()
  tokenFrom: Currency;

  @ManyToOne(() => Currency, { eager: true })
  tokenTo: Currency;

  @Column('float', { default: 0 })
  price: number;
}

export const exchangeRateSchema = {
  id: { type: 'number', required: true, example: 1 },
  tokenFrom: { type: 'number', required: true, example: 1 },
  tokenTo: { type: 'number', required: true, example: 2 },
  price: { type: 'number', required: false, example: 0.001 }
};