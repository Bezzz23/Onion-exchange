import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { Wallet, walletSchema } from '../entity/wallet';

@responsesAll({ 200: { description: 'success' }, 400: { description: 'bad request' } })

@tagsAll(['Wallet'])
export default class UserController {

  @request('get', '/wallets')
  @summary('Get All Wallets')
  public static async getWallets(ctx: BaseContext): Promise<void> {
    const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
    const wallets: Wallet[] = await walletRepository.find();

    ctx.status = 200;
    ctx.body = wallets;
  }

  @request('post', '/wallets')
  @summary('Create a wallet')
  @body(walletSchema)
  public static async createWallet(ctx: BaseContext): Promise<void> {
    const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
    const wallet: Wallet = new Wallet();
    wallet.address = ctx.request.body.address;
    wallet.currency = ctx.request.body.currency;

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
}
