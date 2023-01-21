import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";
import Head from "next/head";
import { useEffect } from "react";
import Router from "next/router";

export default function AboutPage() {
  const wallet = useWallet();

  // useEffect(() => {
  //   if (!wallet.connected) {
  //     Router.push("/");
  //   }
  // }, [wallet.connected]);

  return (
    <>
      <Head>
        <title>Tinbet | About</title>
      </Head>
      <div className="flex flex-col items-center justify-center px-10 py-2">
        <text className="text-2xl">TinBET is made by the 
        <a href="https://gonnamakeit.io/"> gonnamakeit.io </a>  
        team for the 
        <a href="https://www.sandstormhackathon.com/"> Sandstorm Hackathon</a> 
        </text>
      </div>
    </>
  );
}
