import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { SolanaWalletProvider } from "../contexts/SolanaWalletProvider";
import { ProgramProvider } from "../contexts/ProgramProvider";
import Head from "next/head";
import { UserProvider } from "contexts/UserProvider/UserProvider";
import { Footer } from "components/Footer";
import { Analytics } from "@vercel/analytics/react";
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
          <UserProvider>
            <Component {...pageProps} />
            <Analytics />
            <Footer />
          </UserProvider>
        </ProgramProvider>
      </SolanaWalletProvider>
    </>
  );
}

export default MyApp;
