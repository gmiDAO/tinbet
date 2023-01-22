import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";
import Head from "next/head";
import { useEffect, useState } from "react";
import Router from "next/router";
import { useUserContext } from "contexts/UserProvider/hook";
import { UserActionTypes } from "contexts/UserProvider/reducer";

export default function ProfilePage() {
  const wallet = useWallet();
  const { user, dispatch } = useUserContext();

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

      <div className="flex flex-col items-center text-center m-10">
        {wallet.connected && (
          <section className="m-4 w-full flex justify-between items-center">
            <label className="text-xl w-1/2">Logout</label>
            <WalletMultiButtonDynamic />
          </section>
        )}

        <section className="m-4 w-full flex justify-between items-center">
          <label className="text-xl w-1/2">Betting Stake (USDT)</label>
          <input
            type="number"
            className="w-1/2 h-12 border-2 border-gray-400 rounded-md text-center bg-gray-300 font-semibold text-xl hover:text-black focus:text-black md:text-basecursor-default"
            value={user.stake}
            onChange={(e) => {
              const newStake =
                e.target.value === "" ? 0.1 : parseFloat(e.target.value);
              dispatch({
                type: UserActionTypes.SET_STAKE,
                payload: newStake,
              });
            }}
            step="0.1"
          ></input>
        </section>
      </div>
    </>
  );
}
