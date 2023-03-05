import { NetworkApi, WalletApi } from '@thepowereco/tssdk';
import {writeFileSync} from 'fs';

//register in chain number 1033
let acc = await WalletApi.registerCertainChain(1033);
console.log('register data',acc);

//save account data to file
const networkApi = new NetworkApi(1033);
const walletApi = new WalletApi(networkApi);

let password='111';
let hint='three one';
const exportedData =  walletApi.getExportData(acc.wif, acc.address, password, hint);
writeFileSync('example.pem', exportedData);