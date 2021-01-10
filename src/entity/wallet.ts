import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Length, IsNumber } from 'class-validator';
import { Currency } from './currency';
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

  @OneToOne(() => Currency)
  @JoinColumn()
  currency: string

  @Column()
  @IsNumber()
  balance: number;
}

export const walletSchema = {
  id: { type: 'number', required: true, example: 1 },
  address: { type: 'string', required: true, example: 2 },
  currency: { type: 'string', required: true, example: 'etheriumfdsafdsaf' },
  balance: { type: 'number', required: false, example: 8 }
};