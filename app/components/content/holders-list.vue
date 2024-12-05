<template>
  <div class="not-prose">
    <section v-if="pending">Loading...</section>
    <section v-else-if="error">Something went wrong... Try again!</section>
    <section v-else>
      <ul class="grid grid-cols-1 gap-4">
        <li
          v-for="holder in holders"
          :key="holder.name"
          class="border border-gray-200 dark:border-gray-800 rounded-sm p-4 hover:bg-gray-200 dark:hover:bg-gray-800 font-mono"
        >
          <a :href="holder.html_url" target="_blank">
            <div class="flex items-center justify-between text-sm">
              <div class="font-semibold">{{ holder.name }}</div>
              <div>Balance: {{ formatGwei(holder.balance) }}</div>
            </div>
            <div class="flex space-x-2">
              <p class="text-sm">Sent: {{ formatGwei(holder.amount_sent) }}</p>

              <p class="text-sm">
                Recived: {{ formatGwei(holder.amount_received) }}
              </p>
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
  pending,
  error,
  dataSet,
  refresh: refreshGraphData,
} = useFetchGraphData(ref(M_TOKEN_CONTRACT));

const holders = computed(() => {
  const list = {};

  dataSet.holders.forEach((holderName) => {
    list[holderName] = {
      name: holderName,
      balance: 0,
      html_url: `https://etherscan.io/token/${M_TOKEN_CONTRACT}?a=${holderName}`,
      tx_count: 0,
      amount_sent: 0,
      amount_received: 0,
    };
  });

  dataSet.transactions.forEach((tx) => {
    const { sender, recipient, amount } = tx;

    list[sender].tx_count += 1;
    list[sender].amount_sent += +amount;
    list[recipient].amount_received += +amount;
    list[sender].balance -= +amount;
    list[recipient].balance += +amount;
  });

  return Object.values(list)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);
});

await refreshGraphData();
</script>
