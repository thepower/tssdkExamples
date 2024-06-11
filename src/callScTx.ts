import {
  NetworkApi,
  WalletApi,
  EvmCore,
  EvmContract,
} from "@thepowereco/tssdk";
import { readFileSync } from "fs";
import greeter_sol_Greeter from "../greeter_sol_Greeter.json";

async function main() {
  //load account data from file
  const importNetworkApi = new NetworkApi(1);
  const importWalletApi = new WalletApi(importNetworkApi);
  let password = "111";
  const importedData = readFileSync("example.pem");
  const importedWallet = await importWalletApi.parseExportData(
    importedData.toString(),
    password
  );
  console.log("import data", importedWallet);

  //load balance for account
  const networkAPi = new NetworkApi(1);
  await networkAPi.bootstrap();

  const walletApi = new WalletApi(networkAPi);
  const accountData = await walletApi.loadBalance(importedWallet.address);
  console.log("accountData", accountData);

  //call function from smart-contract locale
  const EVM = await EvmCore.build(networkAPi);
  const storageSc = await EvmContract.build(
    EVM,
    importedWallet.address,
    greeter_sol_Greeter
  );
  const greetMessage = await storageSc.scGet("greet", []);
  console.log(greetMessage);

  //call function from smart-contract in blockchain
  const resSet = await storageSc.scSet(importedWallet, "setGreeting", [
    "New hello!",
  ]);
  console.log(resSet);
}
main();
