<template>
  <div class="not-prose">
    <section v-if="pendingMd">Loading MetaData...</section>
    <section v-else-if="pendingMs">Loading Metrics...</section>
    <section v-else-if="error">
      Something went wrong while loading MetaData... Try again!
    </section>
    <section v-else>
      <div class="flex space-x-2 justify-between">
        <div class="flex gap-3 flex-col mt-2">
          <div class="font-semibold text-xl">{{ md.name }}</div>
          <p class="text-sm">Symbol: {{ md.symbol }}</p>
          <p class="text-sm">Decimals: {{ md.decimals }}</p>
          <p class="text-sm">Total Supply: {{ ms.totalSupply }}</p>
          <p class="text-sm">
            Total Earning Supply: {{ ms.totalEarningSupply }}
          </p>
          <p class="text-sm">Earner Rate: {{ ms.earnerRate }}</p>
        </div>
        <div class="w-1/2">
          <ChartTest :chart-data="myData" :chart-lbl="myLabels" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { M_TOKEN_CONTRACT } from "../../config/query";

const myLabels = ["Total Supply", "Total Earning Supply"];

const error = ref(false);

const {
  metrics,
  pending: pendingMs,
  refresh: refreshMetrics,
} = useFetchTokenMetrics(ref(M_TOKEN_CONTRACT));

const ms = computed(() => {
  return {
    symbol: metrics.contractSymbol,
    totalSupply: metrics.totalSupply,
    totalSupplyN: Number(metrics.totalSupply),
    totalEarningSupply: metrics.totalEarningSupply,
    totalEarningSupplyN: Number(metrics.totalEarningSupply),
    earnerRate: metrics.earnerRate,
  };
});

const myData = computed(() => {
  return [ms.value.totalSupplyN, ms.value.totalEarningSupplyN];
});

const {
  metadata,
  refresh: refreshMetaData,
  pending: pendingMd,
} = useFetchTokenMetadata(ref(M_TOKEN_CONTRACT));

const md = computed(() => {
  return {
    symbol: metadata.value.symbol,
    name: metadata.value.name,
    decimals: metadata.value.decimals,
  };
});

refreshMetrics();
refreshMetaData();
</script>
