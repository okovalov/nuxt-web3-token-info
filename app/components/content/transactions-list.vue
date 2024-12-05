<template>
  <div class="not-prose">
    <section v-if="pending">Loading...</section>
    <section v-else-if="error">Something went wrong... Try again!</section>
    <section v-else>
      <ul class="grid grid-cols-1 gap-4 mb-4">
        <li
          v-for="tx in txs"
          :key="tx.hash"
          class="border border-gray-200 dark:border-gray-800 rounded-sm p-4 hover:bg-gray-200 dark:hover:bg-gray-800 font-mono"
        >
          <a :href="tx.html_url" target="_blank">
            <div class="flex space-x-2 justify-between">
              <div class="flex flex-col">
                <div class="font-semibold mb-2">{{ tx.hash }}</div>
                <p class="text-sm">From: {{ tx.from }}</p>
                <p class="text-sm">To: {{ tx.to }}</p>
              </div>
              <div class="flex flex-col items-end justify-between text-sm mb-3">
                <div>Date: {{ tx.date }}</div>
                <div>Amount: {{ tx.amount }}</div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { formatGwei } from "viem";
import { M_TOKEN_CONTRACT } from "../../config/query";

const {
  dataSet,
  refresh: refreshGraphData,
  pending,
  error,
} = useFetchGraphData(ref(M_TOKEN_CONTRACT));

const txs = computed(() => {
  const list = {};

  dataSet.transactions.forEach((tx) => {
    const {
      transactionHash,
      formattedDate,
      formattedTime,
      sender,
      recipient,
      amount,
      blockTimestamp,
    } = tx;

    list[transactionHash] = {
      html_url: `https://etherscan.io/tx/${transactionHash}`,
      hash: transactionHash,
      date: formattedDate,
      dateTiime: formattedTime,
      amount: formatGwei(amount),
      from: sender,
      to: recipient,
      timestamp: blockTimestamp,
    };
  });

  return Object.values(list)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 25);
});

await refreshGraphData();
</script>
