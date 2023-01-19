import {
  MarketStatus,
  createOrder,
  GetAccount,
  MarketAccount,
} from "@monaco-protocol/client";
import { Program } from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

// const mintToken = "Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH"; // WINS (devnet)
const mintToken = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT
const mintDecimals = 6;
const marketsStatus = MarketStatus.Open;

export const getMarketCards = async (): Promise<any | undefined> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API as string);
    const marketCards = await response.json();
    console.log(marketCards);
    return marketCards;
  } catch (err) {
    console.log(err);
  }
};

export type Bet = {
  forOutcome: boolean;
  marketOutcome: string;
  marketOutcomeIndex: number;
  odds: number;
  stake: number;
};

export const placeBet = async (
  program: Program,
  marketPk: string,
  bet: Bet
) => {
  try {
    const stakeInteger = new BN(bet.stake * 10 ** mintDecimals);
    const createOrderResponse = await createOrder(
      program,
      new PublicKey(marketPk),
      bet.marketOutcomeIndex,
      bet.forOutcome,
      bet.odds,
      stakeInteger
    );
    console.log(createOrderResponse);
  } catch (e) {
    console.error(e);
  }
};
