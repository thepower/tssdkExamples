import {
  NetworkApi,
  WalletApi,
  EvmCore,
  EvmContract,
} from "@thepowereco/tssdk";
import { readFileSync } from "fs";
import greeterAbi from "./greeter_sol_Greeter.json" assert { type: "json" };

async function main() {
  //load account data from file
  const networkApi = new NetworkApi(1);
  await networkApi.bootstrap();

  const walletApi = new WalletApi(networkApi);
  let password = "111";
  const importedData = readFileSync("example.pem");
  const importedWallet = await walletApi.parseExportData(
    importedData.toString(),
    password
  );
  console.log("import data", importedWallet);

  //load balance for account
  const accountData = await walletApi.loadBalance(importedWallet.address);
  console.log("accountData", accountData);

  //call function from smart-contract locale
  const EVM = await EvmCore.build(networkApi);
  const storageSc = await EvmContract.build(
    EVM,
    importedWallet.address,
    greeterAbi
  );
  const greetMessage = await storageSc.scGet("greet", []);
  console.log(greetMessage);
}

main();
