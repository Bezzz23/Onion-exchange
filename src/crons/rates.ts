import { getManager, Repository } from 'typeorm';
import { BinanceWebsocketClient } from './websocketClient';
import { Currency } from '../entity/currency';
import { ExchangeRate } from '../entity/exchangeRate';
import { config } from '../config';

type MessageData = {
  method: string;
  params: Array<string>;
  id: number;
}

type MessageResponse = {
  result?: null;
  s?: string;
  b?: string;
}

interface Pairs {
  [key: string]: {
    ids: Array<number>;
    id?: number;
    price?: string;
  };
}

interface UpdatedPair {
  [key: string]: string;
}

const delay = (time: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

const getCurrencyPairs = async (): Promise<Pairs> => {
  const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
  const currencies: Currency[] = await currencyRepository.find();
  const pairs: Pairs = {};

  let index = 0;
  currencies.forEach(currency => {
    index++;
    currencies.forEach(anotherCurrency => {
      if (anotherCurrency.id !== currency.id) {
        index++;
        pairs[`${currency.token.toLowerCase()}${anotherCurrency.token.toLowerCase()}`] = {
          ids: [currency.id, anotherCurrency.id],
          id: index,
        };
      }
    });
  });

  return pairs;
};


export default class BinanceRates {
  wsClient: BinanceWebsocketClient;
  pairs: Pairs = {};
  updatedPairs: UpdatedPair = {};
  updateIndex = 1;
  currencyInterval: ReturnType<typeof setTimeout>;
  binanceInteval: ReturnType<typeof setTimeout>;

  constructor(readonly updateCurrencyTime: number, readonly updateSubscribeTime: number) {
    this.wsClient = new BinanceWebsocketClient(config.binanceEndpoint);
  }

  sendSubscribeMessage() {
    const pairsKeys = Object.keys(this.pairs);
    const subscribeData: MessageData = {
      method: 'SUBSCRIBE',
      params: pairsKeys.map((quotation) => `${quotation}@bookTicker`),
      id: this.updateIndex
    };

    this.wsClient.sendMessage(subscribeData);
  }

  subscribeCurrency() {
    this.currencyInterval = setInterval(async () => {
      this.pairs = await getCurrencyPairs();
      this.sendSubscribeMessage();
      this.updateIndex++;
    }, this.updateSubscribeTime);
  }

  async createExchange(updatedKey: string) {
    await delay();
    const exchangeRateRepository: Repository<ExchangeRate> = getManager().getRepository(ExchangeRate);
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
    const exchangeRate: ExchangeRate = new ExchangeRate();
    const tokenFrom: Currency = await currencyRepository.findOne({ where: { id: this.pairs[updatedKey].ids[0] } });
    const tokenTo: Currency = await currencyRepository.findOne({ where: { id: this.pairs[updatedKey].ids[1] } });

    exchangeRate.tokenFrom = tokenFrom;
    exchangeRate.tokenTo = tokenTo;
    exchangeRate.price = parseFloat(this.updatedPairs[updatedKey]);
    await exchangeRateRepository.save(exchangeRate);
  }

  subscribeCreateExchange() {
    this.binanceInteval = setInterval(() => {
      const updatedKeys = Object.keys(this.updatedPairs);
      updatedKeys.forEach(async (updatedKey) => {
        await this.createExchange(updatedKey);
      });
    }, this.updateCurrencyTime);
  }

  unsubscribeCreateExchange() {
    clearInterval(this.binanceInteval);
  }

  unsubscribeCurrency() {
    clearInterval(this.currencyInterval);
  }

  subscribe() {
    this.wsClient.onConnect(async () => {
      this.subscribeCurrency();
      this.wsClient.onMessage((msg: { data?: string }) => {
        const data: MessageResponse = JSON.parse(msg.data);
        const pairsKeys = Object.keys(this.pairs);

        pairsKeys.map(quotation => {
          if (data.s === quotation.toUpperCase()) {
            this.updatedPairs[quotation] = data.b;
          }
        });
      });
      this.subscribeCreateExchange();
    });

    return {
      unsubscribe: this.unsubscribe
    };
  }

  unsubscribe() {
    this.unsubscribeCurrency();
    this.unsubscribeCreateExchange();
    this.wsClient.close();
  }
}
