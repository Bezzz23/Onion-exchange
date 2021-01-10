import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(0, 10)
  token: string;

  @Column()
  name: string;
}

export const currencySchema = {
  id: { type: 'number', required: true, example: 1 },
  token: { type: 'string', required: true, example: 'ETH' },
  name: { type: 'string', required: false, example: 'Etherium' },
};