import { NetworkApi, WalletApi, TransactionsApi } from '@thepowereco/tssdk';
import {readFileSync} from 'fs';
//load account data from file
const importNetworkApi = new NetworkApi(1025);
const importWalletApi = new WalletApi(importNetworkApi);
let password='111';
const importedData = readFileSync("example.pem");
const importedWallet = await importWalletApi.parseExportData(importedData.toString(), password);
console.log('import data',importedWallet);

//load balance for account
const letNetworkApi = new NetworkApi(1025);
await letNetworkApi.bootstrap();
let subChain = await letNetworkApi.getAddressChain(importedWallet.address);
const networkApi = new NetworkApi(subChain.chain);
await networkApi.bootstrap();
const walletApi = new WalletApi(networkApi);
const accountData= await walletApi.loadBalance(importedWallet.address);
console.log('accountData',accountData);

//deploy smart-contract
const code = readFileSync("greeter_sol_Greeter.bin");
let deployTX= TransactionsApi.composeDeployTX(importedWallet.address,code.toString(),[],'',0,importedWallet.wif,"evm",networkApi.feeSettings,networkApi.gasSettings);
let resDeploy=await networkApi.sendPreparedTX(deployTX);
console.log(resDeploy);