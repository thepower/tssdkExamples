import { NetworkApi, WalletApi } from "@thepowereco/tssdk";
import { readFileSync } from "fs";

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
  const letNetworkApi = new NetworkApi(1);
  await letNetworkApi.bootstrap();
  //find the chain where the account is
  let subChain = await letNetworkApi.getAddressChain(importedWallet.address);
  const networkApi = new NetworkApi(subChain.chain);
  await networkApi.bootstrap();
  const walletApi = new WalletApi(networkApi);
  const accountData = await walletApi.loadBalance(importedWallet.address);
  console.log("accountData", accountData);

  //send 10 tokens to another account
  let to = "AA100000001677745092";
  let amount = 10;
  let comment = "test";

  let res = await walletApi.makeNewTx(
    importedWallet.wif,
    importedWallet.address,
    to,
    "SK",
    amount,
    comment
  );
  console.log(res);
}

main();
