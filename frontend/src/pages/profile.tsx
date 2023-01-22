import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";
import Head from "next/head";
import { useEffect, useState } from "react";
import Router from "next/router";
import { useUserContext } from "contexts/UserProvider/hook";
import { UserActionTypes } from "contexts/UserProvider/reducer";
import Link from "next/link";

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

      <div className="flex flex-col min-h-full max-w-xl mx-auto text-left mt-20">
        {wallet.connected && (
          <div className="m-4 w-auto flex items-center ">
            <label className="text-xl flex-grow">Logout</label>
            <WalletMultiButtonDynamic />
          </div>
        )}

        <div className="m-4 w-auto flex  items-center ">
          <label className="text-xl flex-grow">Betting Stake (USDT)</label>
          <input
            type="number"
            className="w-44 h-12 border-2 border-gray-400 rounded-md text-center bg-gray-300 font-semibold text-xl hover:text-black focus:text-black md:text-basecursor-default"
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
        </div>
        <div className="m-10 flex  justify-center items-center ">
          <Link href="/">
            <a className="btn btn-success text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
              &nbsp; Go Back Betting
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
