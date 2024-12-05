export const M_TOKEN_CONTRACT = "0x866A2BF4E572CbcF37D5071A7a58503Bfb36be1b";

const runtimeConfig = useRuntimeConfig();
export const ALCHEMY_KEY = runtimeConfig.public.alchemyKey;

export const graphHost = "https://subgraph.satsuma-prod.com";
// export const graphToken = runtimeConfig.public.graphToken;
export const graphToken = runtimeConfig.graphToken;

export const graphName = "my-m0token-transfers";
export const graphVersion = "v0.0.1-new-version";
export const graphUrl = `${graphHost}/${graphToken}/oleksandrs-team--101270/${graphName}/version/${graphVersion}/api`;
