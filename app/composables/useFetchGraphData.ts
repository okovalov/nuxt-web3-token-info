import { type Address } from "viem";
import { formatTimeStamp } from "../uilts/helpers";
import { graphUrl } from "../config/query";

const q = `{transfers(first:100){id,sender,recipient,amount,blockNumber,blockTimestamp,transactionHash}}`;

type TxInfo = {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  blockTimestamp: string;
  transactionHash: string;
  formattedTime: string;
  formattedDate: string;
};

type TransferResponse<T> = {
  data: {
    transfers: T[];
  };
};

// will keep it for shorter queries?
// type SenderReceipient = {
//   id: string;
//   sender: string;
//   recipient: string;
// };

export const useFetchGraphData = (contractAddress: globalThis.Ref<Address>) => {
  const pending = ref(false);
  const dataSet = reactive({
    holders: [""],
    transactions: [] as Array<TxInfo>,
  });

  const fetchGraphData = async () => {
    pending.value = true;

    try {
      const {
        error,
        data,
      }: {
        error: globalThis.Ref<unknown>;
        data: globalThis.Ref<TransferResponse<TxInfo>>;
      } = await useFetch(graphUrl, {
        method: "post",
        body: `{"query":"${q}"}`,
      });

      const transfers = computed(() => {
        return data.value?.data?.transfers;
      });

      const holders = computed(() => {
        const res: Array<string> = [];
        transfers.value.forEach((el) => {
          const { recipient, sender } = el;
          res.push(sender);
          res.push(recipient);
        });
        return [...new Set(res)];
      });

      const transactions = computed(() => {
        const res: Array<TxInfo> = [];
        transfers.value.forEach((el) => {
          const { blockTimestamp } = el;
          let formattedTimeFinal = {
            formattedFullDateAndTime: "",
            formattedDate: "",
          };
          try {
            const formattedTime = formatTimeStamp(+blockTimestamp);
            formattedTimeFinal = formattedTime;
          } catch (error) {}
          res.push({
            ...el,
            formattedTime: formattedTimeFinal.formattedFullDateAndTime,
            formattedDate: formattedTimeFinal.formattedDate,
          });
        });
        return res;
      });

      if (error.value) {
        return { holders: [], transactions: [] };
      }

      return {
        holders: holders.value,
        transactions: transactions.value,
      };
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    const { holders, transactions } = await fetchGraphData();
    dataSet.holders = holders;
    dataSet.transactions = transactions;
  };

  watch(contractAddress, async () => await refresh());

  return {
    pending,
    refresh,
    dataSet,
  };
};
