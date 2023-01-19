import {
  getMarketAccountsByStatusAndMintAccount,
  getMarketPrices,
  getMintInfo,
  MarketStatus,
  createOrder,
  GetAccount,
  MarketAccount,
  ClientResponse,
  MarketAccounts,
  MarketPricesAndPendingOrders,
  MarketPrices,
} from "@monaco-protocol/client";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { ProgramConnectedState } from "contexts/ProgramProvider";

// const mintToken = "Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH";
const mintToken = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const mintDecimals = 6;
const marketsStatus = MarketStatus.Open;

export const getMarkets = async (program: Program) => {
  const marketsResponse: ClientResponse<MarketAccounts> =
    await getMarketAccountsByStatusAndMintAccount(
      program,
      marketsStatus,
      new PublicKey(mintToken)
    );

  const marketsData: any[] = [];
  if (marketsResponse.success && marketsResponse.data) {
    //Only get an open market with a non-zero marketOutcomesCount
    const marketsWithOutcomes = marketsResponse.data.markets.filter(
      (market) => market.account.marketOutcomesCount > 0
    );
    for (let i = 0; i < 5; i++) {
      let marketPk = marketsWithOutcomes[i].publicKey;
      let marketPricesData = await getMarketOutcomePriceData(program, marketPk);
      if (!marketPricesData) {
        continue;
      }
      const marketData = {
        pk: marketPk.toString(),
        market: marketsWithOutcomes[i],
        prices: marketPricesData,
      };
      console.log("marketData!!!", marketData);
      marketsData.push(marketData);
    }
  }
  return marketsData;
};

export const getMarketOutcomePriceData = async (
  program: Program,
  marketPk: PublicKey
) => {
  console.log("marketPk", marketPk.toString());
  let marketPricesResponse: ClientResponse<MarketPricesAndPendingOrders> =
    await getMarketPrices(program, marketPk);
  console.log("marketPricesResponse", marketPricesResponse);
  if (marketPricesResponse.success && marketPricesResponse.data) {
    return getBestMarketOutcomeWithOdd(marketPricesResponse.data);
  }
  return null;
};

const getBestMarketOutcomeWithOdd = (
  marketPricesAndPendingOrders: MarketPricesAndPendingOrders
) => {
  const { marketPrices } = marketPricesAndPendingOrders;
  console.log("marketPrices", marketPrices);

  let marketOutcomes: any = {};
  for (let i = 0; i < marketPrices.length; i++) {
    let marketPrice = marketPrices[i];
    // skip Draw market outcome
    if (marketPrice.marketOutcome === "Draw") {
      continue;
    }
    if (!marketOutcomes[marketPrice.marketOutcome]) {
      marketOutcomes[marketPrice.marketOutcome] = {
        marketOutcomeIndex: marketPrice.marketOutcomeIndex,
        forOutcomePrice: 0,
        againstOutcomePrice: 0,
      };
    }
    if (
      marketPrice.forOutcome &&
      marketPrice.price >
        marketOutcomes[marketPrice.marketOutcome].forOutcomePrice
    ) {
      marketOutcomes[marketPrice.marketOutcome].forOutcomePrice =
        marketPrice.price;
    } else if (
      !marketPrice.forOutcome &&
      marketPrice.price >
        marketOutcomes[marketPrice.marketOutcome].againstOutcomePrice
    ) {
      marketOutcomes[marketPrice.marketOutcome].againstOutcomePrice =
        marketPrice.price;
    }
  }
  console.log("marketOutcomes", marketOutcomes);
  if (Object.keys(marketOutcomes).length !== 2) {
    return null;
  }
  let marketOutcomeA = Object.keys(marketOutcomes)[0];
  let marketOutcomeB = Object.keys(marketOutcomes)[1];
  for (let marketOutcome in marketOutcomes) {
    let forOutcomePrice = marketOutcomes[marketOutcome].forOutcomePrice;
    let againstOutcomePrice = marketOutcomes[marketOutcome].againstOutcomePrice;
    if (forOutcomePrice > 0 && againstOutcomePrice > 0) {
      return {
        marketOutcome: marketOutcome,
        marketOutcomeAgainst:
          marketOutcome === marketOutcomeA ? marketOutcomeB : marketOutcomeA,
        marketOutcomeIndex: marketOutcomes[marketOutcome].marketOutcomeIndex,
        forOutcomePrice: forOutcomePrice,
        againstOutcomePrice: againstOutcomePrice,
      };
    }
  }
  return null;
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
  market: GetAccount<MarketAccount>,
  bet: Bet
) => {
  try {
    const stakeInteger = new BN(bet.stake * 10 ** mintDecimals);

    const createOrderResponse = await createOrder(
      program,
      market.publicKey,
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
