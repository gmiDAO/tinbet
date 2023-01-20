import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";
import Head from "next/head";
import { useEffect } from "react";
import Router from "next/router";

export default function ProfilePage() {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) {
      Router.push("/");
    }
  }, [wallet.connected]);
  return (
    <>
      <Head>
        <title>Tinbet | Profile </title>
      </Head>
      <div className="flex flex-col items-center justify-center px-10 py-2">
        {wallet.connected && (
          <section className="flex flex-col items-center justify-center">
            <label className="text-xl">Logout</label>
            <WalletMultiButtonDynamic />
          </section>
        )}
      </div>
    </>
  );
}
