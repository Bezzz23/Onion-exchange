import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { Currency, currencySchema } from '../entity/currency';

@responsesAll({ 200: { description: 'success' }, 400: { description: 'bad request' } })

@tagsAll(['Currency'])
export default class CurrencyController {

  @request('get', '/currencies')
  @summary('Get All currencies')
  public static async getCurrencies(ctx: BaseContext): Promise<void> {
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
    const currencies: Currency[] = await currencyRepository.find();

    ctx.status = 200;
    ctx.body = currencies;
  }

  @request('post', '/currencies')
  @summary('Create a currency')
  @body(currencySchema)
  public static async createCurrency(ctx: BaseContext): Promise<void> {
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
    const currency: Currency = new Currency();
    currency.token = ctx.request.body.token;
    currency.name = ctx.request.body.name;

    const errors: ValidationError[] = await validate(currency);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (await currencyRepository.findOne({ token: currency.token })) {
      ctx.status = 400;
      ctx.body = 'Token already exists';
    } else {
      const currencySaved = await currencyRepository.save(currency);
      ctx.status = 201;
      ctx.body = currencySaved;
    }
  }
}
