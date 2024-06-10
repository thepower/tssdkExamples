import { NetworkApi, WalletApi, EvmCore, EvmContract} from '@thepowereco/tssdk';
import { readFileSync } from 'fs';
import greeter_sol_Greeter from './greeter_sol_Greeter.json' assert { type: 'json' };

async function main() {

//load account data from file
const importNetworkApi = new NetworkApi(1);
const importWalletApi = new WalletApi(importNetworkApi);
let password='111';
const importedData = readFileSync("example.pem");
const importedWallet = await importWalletApi.parseExportData(importedData.toString(), password);
console.log('import data',importedWallet);

//load balance for account
const letNetworkApi = new NetworkApi(1);
await letNetworkApi.bootstrap();
let subChain = await letNetworkApi.getAddressChain(importedWallet.address);
const networkApi = new NetworkApi(subChain.chain);
await networkApi.bootstrap();
const walletApi = new WalletApi(networkApi);
const accountData= await walletApi.loadBalance(importedWallet.address);
console.log('accountData',accountData)

//call function from smart-contract locale
const EVM = await EvmCore.build(networkApi);
const storageSc = await EvmContract.build(EVM,importedWallet.address, greeter_sol_Greeter);
const greetMessage = await storageSc.scGet(
'greet',
[],
);
console.log(greetMessage);

//call function from smart-contract in blockchain
const resSet = await storageSc.scSet(
    importedWallet,
    'setGreeting',
    ['New hello!'],
    );
console.log(resSet);

}   
main();