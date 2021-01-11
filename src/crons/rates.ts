import { getManager, Repository } from 'typeorm';
import { BinanceWebsocketClient } from './websocketClient';
import { Currency } from '../entity/currency';
import { ExchangeRate } from '../entity/exchangeRate';
import { config } from '../config';

let binanceInteval: ReturnType<typeof setTimeout>;

type MessageData = {
  method: string;
  params: Array<string>;
  id: number;
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

type inputParams = {
  updateTime: number;
}

const subscribeBinanceRates = ({ updateTime }: inputParams) => {
  const wsClient = new BinanceWebsocketClient(config.binanceEndpoint);

  const updateMarketExchanges = async () => {
    let updateIndex = 1;
    const currencyRepository: Repository<Currency> = getManager().getRepository(Currency);
    const exchangeRateRepository: Repository<ExchangeRate> = getManager().getRepository(ExchangeRate);
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

    const pairsKeys = Object.keys(pairs);
    const updatedObj: UpdatedPair = {};

    const subscribeData: MessageData = {
      method: 'SUBSCRIBE',
      params: pairsKeys.map((quotation) => `${quotation}@bookTicker`),
      id: updateIndex
    };

    const unsubscribeData: MessageData = {
      method: 'UNSUBSCRIBE',
      params: pairsKeys.map((quotation) => `${quotation}@bookTicker`),
      id: updateIndex
    };

    wsClient.sendMessage(subscribeData);

    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }

    async function createExchange(updatedKey: string) {
      await delay();

      const exchangeRate: ExchangeRate = new ExchangeRate();
      exchangeRate.tokenFrom = pairs[updatedKey].ids[0];
      exchangeRate.tokenTo = pairs[updatedKey].ids[1];
      exchangeRate.price = parseFloat(updatedObj[updatedKey]);
      await exchangeRateRepository.save(exchangeRate);
    }

    wsClient.onMessage((msg: { data?: string }) => {
      const data: { result?: null; s?: string; b?: string } = JSON.parse(msg.data);
      let updatedPairs = [...pairsKeys];

      pairsKeys.map(quotation => {
        if (data.s === quotation.toUpperCase()) {
          updatedObj[quotation] = data.b;
          updatedPairs = updatedPairs.filter(pair => pair !== quotation);
        }
      });

      const updatedKeys = Object.keys(updatedObj);

      if (updatedKeys.length >= pairsKeys.length / 2) {
        updatedKeys.forEach(async (updatedKey) => {
          await createExchange(updatedKey);
        });
        wsClient.sendMessage(unsubscribeData);
      }
    });

    updateIndex++;
  };


  wsClient.onConnect(async () => {
    binanceInteval = setInterval(function () {
      updateMarketExchanges();
    }, updateTime);
  });
};

const unsubscribeBinanceRates = () => {
  clearInterval(binanceInteval);
};


export { subscribeBinanceRates, unsubscribeBinanceRates };