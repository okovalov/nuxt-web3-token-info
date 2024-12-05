import { type Address } from "viem";
import { Network, Alchemy } from "alchemy-sdk";
import { ALCHEMY_KEY } from "../config/query";

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

export const useFetchTokenMetadata = (
  contractAddress: globalThis.Ref<Address>,
) => {
  const alchemy = new Alchemy(settings);

  type GetTokenMetadataResponse = ReturnType<
    typeof alchemy.core.getTokenMetadata
  >;

  const pending = ref(false);
  const metadata = ref({} as Awaited<GetTokenMetadataResponse>);

  const fetchMetaData = async () => {
    pending.value = true;

    const metadata = await alchemy.core.getTokenMetadata(contractAddress.value);

    pending.value = false;

    return metadata;
  };

  const refresh = async () => {
    const metadataFetched = await fetchMetaData();
    metadata.value = metadataFetched;
  };

  watch(contractAddress, async () => await refresh());

  return {
    pending,
    refresh,
    metadata,
    // to add proper error handling
    error: toRef(false),
  };
};
