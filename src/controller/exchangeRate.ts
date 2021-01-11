import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, body, responsesAll, tagsAll, query } from 'koa-swagger-decorator';
import { ExchangeRate, exchangeRateSchema } from '../entity/exchangeRate';
import { Currency } from '../entity/currency';


export interface ExhcnageRatesFilter {
  tokenFrom?: number;
  tokenTo?: number;
}

@responsesAll({ 200: { description: 'success' }, 400: { description: 'bad request' } })


@tagsAll(['Currency'])
export default class ExchangeRateController {

  @request('get', '/exchanges')
  @summary('Get All exchange rates')
  @query({
    tokenFrom: { type: 'number', description: 'token from' },
    tokenTo: { type: 'number', description: 'token to' },
  })
  public static async getExchangeRates(ctx: BaseContext): Promise<void> {

    const { tokenFrom, tokenTo } = ctx.query;
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);

    const filter: ExhcnageRatesFilter = {};

    if (tokenFrom && tokenTo) {
      const tokenFromExist = await currencyRepository.findOne({ id: tokenFrom });
      if (!tokenFromExist) {
        ctx.status = 400;
        ctx.body = 'tokenFrom does not exists';
        return;
      }

      const tokenToExist = await currencyRepository.findOne({ id: tokenTo });
      if (!tokenToExist) {
        ctx.status = 400;
        ctx.body = 'tokenTo does not exists';
        return;
      }

      filter.tokenFrom = tokenFrom;
      filter.tokenTo = tokenTo;
    }

    const exchangeRateRepository: Repository<ExchangeRate> = getManager().getRepository(ExchangeRate);
    const exchangeRates: ExchangeRate[] = await exchangeRateRepository.find(filter);

    ctx.status = 200;
    ctx.body = exchangeRates;
  }

  @request('post', '/exchanges')
  @summary('Create exchange rate')
  @body(exchangeRateSchema)
  public static async createExchangeRate(ctx: BaseContext): Promise<void> {
    const exchangeRateRepository: Repository<ExchangeRate> = getManager().getRepository(ExchangeRate);
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
    const exchangeRate: ExchangeRate = new ExchangeRate();

    const tokenFromParam = ctx.request.body.tokenFrom;
    const tokenToParam = ctx.request.body.tokenTo;

    const tokenFrom = await currencyRepository.findOne({ id: tokenFromParam });
    if (!tokenFrom) {
      ctx.status = 400;
      ctx.body = 'tokenFrom does not exists';
      return;
    }

    const tokenTo = await currencyRepository.findOne({ id: tokenToParam });
    if (!tokenTo) {
      ctx.status = 400;
      ctx.body = 'tokenTo does not exists';
      return;
    }

    exchangeRate.tokenFrom = tokenFromParam;
    exchangeRate.tokenTo = tokenToParam;

    const errors: ValidationError[] = await validate(exchangeRate);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else {
      const exchangeSaved = await exchangeRateRepository.save(exchangeRate);
      ctx.status = 201;
      ctx.body = exchangeSaved;
    }
  }
}
