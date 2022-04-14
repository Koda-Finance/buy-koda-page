import React, { useEffect, useState } from "react";
import Web3 from "web3";
import routerAbi from "../abis/routerAbi.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import {
  WEB3_BSC_LINK,
  KODA_TO_BUSD_ROUTE,
  SUMMITSWAP_ROUTER_ADDRESS,
  PANCAKE_SWAP_ROUTER_V2_ADDRESS,
} from "../constants";

const KodaPrice = () => {
  const [pricePancakeswap, setPricePancakeswap] = useState(0);
  const [priceSummitswap, setPriceSummitswap] = useState(0);

  const web3 = new Web3(WEB3_BSC_LINK);

  useEffect(() => {
    async function init() {
      const kodaPrice = await getAmountsOut(
        routerContract,
        KODA_TO_BUSD_ROUTE,
        1
      );
      setPricePancakeswap(kodaPrice);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function init() {
      const kodaPrice = await getAmountsOut(
        routerContract2,
        KODA_TO_BUSD_ROUTE,
        1
      );
      setPriceSummitswap(kodaPrice);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routerContract = new web3.eth.Contract(
    routerAbi as AbiItem[],
    PANCAKE_SWAP_ROUTER_V2_ADDRESS
  );

  const routerContract2 = new web3.eth.Contract(
    routerAbi as AbiItem[],
    SUMMITSWAP_ROUTER_ADDRESS
  );

  async function getAmountsOut(
    router: Contract,
    route: string[],
    amount: number
  ) {
    try {
      const amountsInWei = web3.utils.toWei(amount.toString(), "ether");
      const amountsOutInWei = await router.methods
        .getAmountsOut(amountsInWei, route)
        .call()
        .then((o: string) => {
          return o[o.length - 1];
        });
      const amountsOutInEther = web3.utils.fromWei(amountsOutInWei, "ether");
      return Number(Number(amountsOutInEther).toFixed(10));
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  return (
    <div>
      Cheapest Koda Price is:
      {pricePancakeswap < priceSummitswap ? pricePancakeswap : priceSummitswap}
    </div>
  );
};

export default KodaPrice;
