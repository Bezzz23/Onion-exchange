import { Entity, Column, PrimaryGeneratedColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Length } from 'class-validator';
import { Currency } from './currency';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Currency)
  @PrimaryColumn({ type: 'int', name: 'tokenTo_id' })
  tokenFrom: number;

  @OneToOne(() => Currency)
  @PrimaryColumn({ type: 'int', name: 'tokenFrom_id' })
  tokenTo: number;

  @Column('float', { default: 0 })
  price: number;
}

export const exchangeRateSchema = {
  id: { type: 'number', required: true, example: 1 },
  tokenFrom: { type: 'number', required: true, example: 1 },
  tokenTo: { type: 'number', required: true, example: 2 },
  price: { type: 'number', required: false, example: 0.001 }
};