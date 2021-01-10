import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/e75916500a094970b9851d37c3c198ad'));

const getBalanceByAddress = async () => {
  const balance = await web3.eth.getBalance('0x1FF516E5ce789085CFF86d37fc27747dF852a80a');
  console.error(web3.utils.fromWei(balance, 'ether'));
};

export default getBalanceByAddress;