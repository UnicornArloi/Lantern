"use client";

import { WagmiProvider, createConfig, http, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, bsc } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { ReactNode } from "react";

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  connectors: [],
});

const queryClient = new QueryClient();

const CONTRACT_ADDRESS = "0x8C1C4249D2A36Ed51B1a270FcB6C93371F3a7a52";

const CONTRACT_ABI = [
  {"inputs":[],"name":"buyLottery","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"name":"_amount","type":"uint256"}],"name":"depositToPool","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getPoolBalance","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"marketingWallet","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"prizePool","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"rewardToken","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"_wallet","type":"address"}],"name":"setMarketingWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"_token","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"_to","type":"address"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"player","type":"address"},{"indexed":false,"name":"result","type":"uint8"},{"indexed":false,"name":"reward","type":"uint256"}],"name":"LotteryBought","type":"event"}
];

export { CONTRACT_ADDRESS, CONTRACT_ABI };

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useBuyLottery() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const buy = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "buyLottery",
      value: BigInt(0.01 * 1e18),
    });
  };
  
  return { hash, buy, isPending };
}

export function usePrizePool() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPoolBalance",
  });
}

export function useLotteryResult(hash: string | undefined) {
  return useWaitForTransactionReceipt({ hash });
}
