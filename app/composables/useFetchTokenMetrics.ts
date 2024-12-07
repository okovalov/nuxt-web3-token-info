import { getBalance, readContract } from "@wagmi/core";
import { type Address } from "viem";
import { abi } from "../abis/m0token";
import { config } from "../config/wagmi";

type GetBalanceResponse = ReturnType<typeof getBalance>;

export const useFetchTokenMetrics = (
  contractAddress: globalThis.Ref<Address>,
) => {
  const pending = ref(false);
  const metrics = reactive({
    totalSupply: 0n,
    totalEarningSupply: 0n,
    contractSymbol: "",
    earnerRate: 0,
    balance: {} as Awaited<GetBalanceResponse>,
  });

  const fetchMetrics = async () => {
    pending.value = true;

    let totalSupply;

    try {
      totalSupply = await readContract(config, {
        abi,
        address: contractAddress.value,
        functionName: "totalSupply",
      });
    } catch (error) {
      console.log(
        "error while trying to call totalSupply on a readContract",
        error,
      );
    }

    let totalEarningSupply;

    try {
      totalEarningSupply = await readContract(config, {
        abi,
        address: contractAddress.value,
        functionName: "totalEarningSupply",
      });
    } catch (error) {
      console.log(
        "error while trying to call totalEarningSupply on a readContract",
        error,
      );
    }

    let contractSymbol;

    try {
      contractSymbol = await readContract(config, {
        abi,
        address: contractAddress.value,
        functionName: "symbol",
      });
    } catch (error) {
      console.log("error while trying to call symbol on a readContract", error);
    }

    let earnerRate;

    try {
      earnerRate = await readContract(config, {
        abi,
        address: contractAddress.value,
        functionName: "earnerRate",
      });
    } catch (error) {
      console.log(
        "error while trying to call earnerRate on a readContract",
        error,
      );
    }

    // Disabling it for now, as my free tier causes cloudfront.eth treshold very often to happen :(
    // let balance;
    //
    // try {
    //   balance = await getBalance(config, {
    //     address: contractAddress.value,
    //   });
    // } catch (error) {
    //   console.log(
    //     "error while trying to call balance on a readContract",
    //     error,
    //   );
    // }

    pending.value = false;

    return {
      totalSupply,
      totalEarningSupply,
      contractSymbol,
      earnerRate,
      // balance,
    };
  };

  const refresh = async () => {
    const { totalSupply, totalEarningSupply, contractSymbol, earnerRate } =
      await fetchMetrics();

    metrics.totalSupply = totalSupply || 10000000000n;
    metrics.totalEarningSupply = totalEarningSupply || 20000000000n;
    metrics.contractSymbol = contractSymbol || "M";
    metrics.earnerRate = earnerRate || 480;
  };

  watch(contractAddress, async () => await refresh());

  return {
    pending,
    refresh,
    metrics,
    error: toRef(false),
  };
};
