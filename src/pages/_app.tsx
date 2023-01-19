import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { SolanaWalletProvider } from "../contexts/SolanaWalletProvider";
import { ProgramProvider } from "../contexts/ProgramProvider";
import Head from "next/head";
// set custom RPC server endpoint for the final website
// const endpoint = "https://explorer-api.devnet.solana.com";
// const endpoint = "http://127.0.0.1:8899";
// const endpoint = "https://ssc-dao.genesysgo.net";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SolanaWalletProvider>
        <ProgramProvider>
          <Component {...pageProps} />
        </ProgramProvider>
      </SolanaWalletProvider>
    </>
  );
}

export default MyApp;
