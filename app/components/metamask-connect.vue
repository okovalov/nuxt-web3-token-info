<template>
  <div class="grid place-items-center h-20">
    <div v-if="!isLogggedIn">
      <button
        v-if="isMetaMaskSupported"
        class="px-4 py-2 rounded-2xl select-none min-w-48 bg-gradient-to-r from-orange-500 to-orange-600 text-gray-50 font-semibold"
        @click="connectWallet"
      >
        Connect Metamask
      </button>
      <title v-else>Install MetaMask extension</title>
    </div>
    <div v-else class="relative">
      <div
        class="text-gray-500 text-xs absolute left-14 -top-6 align-middle min-w-28"
        v-if="showLogOutLabel"
      >
        Click to Log Out
      </div>
      <button
        @mouseenter="showLogOutLabel = true"
        @mouseleave="showLogOutLabel = false"
        @click="disconnectWallet"
        title="Click to Log Out"
        class="px-4 py-2 select-none min-w-48 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 text-gray-50 font-semibold"
      >
        {{ computedAddress }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
declare global {
  interface Window {
    ethereum: any;
  }
}

const showLogOutLabel = ref(false);
const isMetaMaskSupported = ref(false);
const address = ref("");

onMounted(() => {
  isMetaMaskSupported.value = typeof window.ethereum !== "undefined";
});

function addAddressResetOnDisconnect() {
  // here we can initialize our custom wallet
  window.ethereum.on("accountsChanged", (accounts: unknown) => {
    const ifFlag = typeof accounts === "object";
    const ifFlagTwo = Object.keys(accounts as object).length === 0;

    if (ifFlag && ifFlagTwo) {
      // we are disconnected
      address.value = "";
    }
  });
}
async function connectWallet() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  address.value = accounts[0];

  addAddressResetOnDisconnect();
}

async function disconnectWallet() {
  await window.ethereum.request({
    method: "wallet_revokePermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
}
const computedAddress = computed(() => address.value.substring(0, 4) + "....");
const isLogggedIn = computed(() => address.value.length);
</script>
