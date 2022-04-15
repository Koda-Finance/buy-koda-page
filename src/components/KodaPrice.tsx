import React, { useState } from "react";
import Web3 from "web3";
import routerAbi from "../abis/routerAbi.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import {
  WEB3_BSC_LINK,
  WBNB_TO_KODA_ROUTE,
  SUMMITSWAP_ROUTER_ADDRESS,
  PANCAKE_SWAP_ROUTER_V2_ADDRESS,
} from "../constants";

const KodaPrice = () => {
  const [pricePancakeswap, setPricePancakeswap] = useState(0);
  const [priceSummitswap, setPriceSummitswap] = useState(0);
  const [bnbAmount, setBnbAmount] = useState("");
  const web3 = new Web3(WEB3_BSC_LINK);

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
      const amountsOutInGwei = web3.utils.fromWei(amountsOutInWei, "gwei");
      return Number(Number(amountsOutInGwei).toFixed(4));
    } catch (err) {
      console.log(err);
      return 0;
    }
  }


  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBnbAmount(e.target.value);
  };

  const onSubmitHandler = async () => {
      const kodaPancakePrice = await getAmountsOut(
      routerContract,
      WBNB_TO_KODA_ROUTE,
      Number(bnbAmount)
    );

    const kodaSummitPrice = await getAmountsOut(
      routerContract2,
      WBNB_TO_KODA_ROUTE,
      Number(bnbAmount)
    );

    setPricePancakeswap(kodaPancakePrice);
    setPriceSummitswap(kodaSummitPrice);
  };

  return (
    <div>
      <label>
        Enter BnB:
        <input value={bnbAmount} type="number" onChange={onChangeHandler} />
      </label>
      <button onClick={onSubmitHandler}>Enter</button>
      <div>
      <br/>
        Koda:
        {pricePancakeswap < priceSummitswap
          ? pricePancakeswap
          : priceSummitswap}
      </div>
    </div>
  );
};

export default KodaPrice;
