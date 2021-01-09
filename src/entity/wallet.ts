import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsDecimal, IsEthereumAddress } from 'class-validator';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEthereumAddress()
  address: string;

  @Column({
    length: 100
  })
  @Length(10, 100)
  currency: string;

  @Column()
  @IsDecimal()
  balance: number;
}

export const walletSchema = {
  id: { type: 'number', required: true, example: 1 },
  address: { type: 'number', required: true, example: 2 },
  currency: { type: 'string', required: true, example: 'avileslopez.javier@gmail.com' }
};