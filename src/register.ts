import { NetworkApi, WalletApi } from "@thepowereco/tssdk";
import { writeFileSync } from "fs";

async function main() {
  //register in chain number 1
  let acc = await WalletApi.registerCertainChain({ chain: 1 });
  console.log("register data", acc);

  //save account data to file
  const networkApi = new NetworkApi(1);
  await networkApi.bootstrap();

  const walletApi = new WalletApi(networkApi);

  let password = "111";
  let hint = "three one";
  const exportedData = walletApi.getExportData(
    acc.wif,
    acc.address,
    password,
    hint
  );
  writeFileSync("example.pem", exportedData);
}

main();
