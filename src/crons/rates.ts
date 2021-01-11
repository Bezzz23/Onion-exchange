import Web3 from 'web3';
import { getManager, Repository } from 'typeorm';
import { Wallet } from '../entity/wallet';

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/e75916500a094970b9851d37c3c198ad'));


const getETHBalanceAndUpdate = async (wallet: Wallet) => {
  const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
  const balance = await web3.eth.getBalance(wallet.address);
  wallet.balance = parseFloat(web3.utils.fromWei(balance, 'ether'));
  await walletRepository.save(wallet);
};

const getETHBalanceByAddress = async () => {
  const walletRepository: Repository<Wallet> = getManager().getRepository(Wallet);
  const wallets: Wallet[] = await walletRepository.find();
  await Promise.all(wallets.map(getETHBalanceAndUpdate));
};



export default getETHBalanceByAddress;