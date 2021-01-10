import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, body, responsesAll, tagsAll, path } from 'koa-swagger-decorator';
import { Wallet, walletSchema } from '../entity/wallet';
import { Currency } from '../entity/currency';
import getBalanceByAddress from '../crons/balance';

@responsesAll({ 200: { description: 'success' }, 400: { description: 'bad request' } })

@tagsAll(['Wallet'])
export default class UserController {

  @request('get', '/wallets')
  @summary('Get All Wallets')
  public static async getWallets(ctx: BaseContext): Promise<void> {
    const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
    const wallets: Wallet[] = await walletRepository.find();

    getBalanceByAddress();

    ctx.status = 200;
    ctx.body = wallets;
  }

  @request('post', '/wallets')
  @summary('Create a wallet')
  @body(walletSchema)
  public static async createWallet(ctx: BaseContext): Promise<void> {
    const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);

    const wallet: Wallet = new Wallet();
    wallet.address = ctx.request.body.address;

    const currency = await currencyRepository.findOne({ id: ctx.request.body.currency });
    if (!currency) {
      ctx.status = 400;
      ctx.body = 'Currency does not exists';
      return;
    }
    wallet.currency = currency.token;
    wallet.balance = ctx.request.body.balance;

    const errors: ValidationError[] = await validate(wallet);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (await walletRepository.findOne({ address: wallet.address })) {
      ctx.status = 400;
      ctx.body = 'Wallet address already exists';
    } else {
      const walletSaved = await walletRepository.save(wallet);
      ctx.status = 201;
      ctx.body = walletSaved;
    }
  }

  @request('delete', '/wallets/{id}')
  @summary('Delete wallet by id')
  @path({
    id: { type: 'number', required: true, description: 'id of wallet' }
  })
  public static async deleteWallet(ctx: BaseContext): Promise<void> {
    const walletRepository = getManager().getRepository(Wallet);
    const walletToRemove: Wallet | undefined = await walletRepository.findOne(+ctx.params.id || 0);
    if (!walletToRemove) {
      ctx.status = 400;
      ctx.body = 'The wallet you are trying to delete doesn\'t exist in the db';
    } else if (walletToRemove.archived) {
      ctx.status = 400;
      ctx.body = 'The wallet already deleted';
    } else {
      walletToRemove.archived = true;
      const savedWallet = await walletRepository.save(walletToRemove);
      ctx.status = 204;
      ctx.body = savedWallet;
    }

  }
}
