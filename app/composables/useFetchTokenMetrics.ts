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

    const totalSupply = await readContract(config, {
      abi,
      address: contractAddress.value,
      functionName: "totalSupply",
    });

    const totalEarningSupply = await readContract(config, {
      abi,
      address: contractAddress.value,
      functionName: "totalEarningSupply",
    });

    const contractSymbol = await readContract(config, {
      abi,
      address: contractAddress.value,
      functionName: "symbol",
    });

    const earnerRate = await readContract(config, {
      abi,
      address: contractAddress.value,
      functionName: "earnerRate",
    });

    const balance = await getBalance(config, {
      address: contractAddress.value,
    });

    pending.value = false;

    return {
      totalSupply,
      totalEarningSupply,
      contractSymbol,
      earnerRate,
      balance,
    };
  };

  const refresh = async () => {
    const {
      totalSupply,
      totalEarningSupply,
      contractSymbol,
      earnerRate,
      balance,
    } = await fetchMetrics();

    metrics.totalSupply = totalSupply;
    metrics.totalEarningSupply = totalEarningSupply;
    metrics.contractSymbol = contractSymbol;
    metrics.earnerRate = earnerRate;
    metrics.balance = balance;
  };

  watch(contractAddress, async () => await refresh());

  return {
    pending,
    refresh,
    metrics,
    error: toRef(false),
  };
};
