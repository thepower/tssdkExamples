import { NetworkApi, WalletApi, TransactionsApi } from "@thepowereco/tssdk";
import { readFileSync } from "fs";
import greeter_sol_Greeter from "../greeter_sol_Greeter.json";

async function main() {
  //load account data from file
  const networkApi = new NetworkApi(1);
  await networkApi.bootstrap();
  const importWalletApi = new WalletApi(networkApi);
  let password = "111";

  const importedData = readFileSync("example.pem");
  const importedWallet = await importWalletApi.parseExportData(
    importedData.toString(),
    password
  );
  console.log("import data", importedWallet);

  //load balance for account
  const accountData = await importWalletApi.loadBalance(importedWallet.address);
  console.log("accountData", accountData);

  // deploy smart-contract
  const code = readFileSync("greeter_sol_Greeter.bin");
  let deployTX = TransactionsApi.composeDeployTX({
    address: importedWallet.address,
    code: code.toString(),
    initParams: [],
    gasToken: "SK",
    gasValue: 2000000000,
    wif: importedWallet.wif,
    abi: greeter_sol_Greeter,
    feeSettings: networkApi.feeSettings,
    gasSettings: networkApi.gasSettings,
  });
  let resDeploy = await networkApi.sendPreparedTX(deployTX);
  console.log(resDeploy);
}

main();
