import {
  getMarketAccountsByStatusAndMintAccount,
  getMarketPrices,
  MarketStatus,
  createOrder,
  GetAccount,
  MarketAccount,
  ClientResponse,
  MarketAccounts,
  MarketPricesAndPendingOrders,
} from "@monaco-protocol/client";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { getProgram } from "../utils/solana";
import { Environment } from "../types";
import { MarketData, ChosenOutcome, Bet, MarketCard } from "./types";

// const mintToken = "Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH";
const mintToken = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const mintDecimals = 6;
const marketsStatus = MarketStatus.Open;

export const getMarketsAddresses = async (
  env: Environment
): Promise<string[] | null> => {
  const program = await getProgram(env);
  const marketsResponse: ClientResponse<MarketAccounts> =
    await getMarketAccountsByStatusAndMintAccount(
      program,
      marketsStatus,
      new PublicKey(mintToken)
    );
  if (marketsResponse.success && marketsResponse.data) {
    //Only get an open market with onlye between 2 and 3 outcomes
    const validMarketsAddresses = marketsResponse.data.markets.reduce(
      (validMarkets: string[], market: GetAccount<MarketAccount>) => {
        if (
          market.account.marketOutcomesCount >= 2 &&
          market.account.marketOutcomesCount <= 3
        ) {
          validMarkets.push(market.publicKey.toString());
        }
        return validMarkets;
      },
      []
    );
    return validMarketsAddresses;
  }
  return null;
};

export const getMarketCard = async (
  marketAddress: string,
  env: Environment
): Promise<MarketCard | null> => {
  try {
    const program = await getProgram(env);
    const marketPk = new PublicKey(marketAddress);
    let chosenOutcome = await getMarketOutcomePriceData(program, marketPk);
    if (chosenOutcome) {
      const marketData = {
        pk: marketPk.toString(),
        outcome: chosenOutcome,
      };
      return buildMarketCard(marketData);
    }
  } catch (e) {
    console.log("Error getting market data", e);
  }
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
  } catch (e) {
    console.error(e);
  }
};

const getMarketOutcomePriceData = async (
  program: Program,
  marketPk: PublicKey
): Promise<ChosenOutcome | null> => {
  let marketPricesResponse: ClientResponse<MarketPricesAndPendingOrders> =
    await getMarketPrices(program, marketPk);
  if (marketPricesResponse.success && marketPricesResponse.data) {
    return parsedChosenOutcome(marketPricesResponse.data);
  } else {
    console.log("Error getting market prices", marketPricesResponse.errors);
  }
  return null;
};

const parsedChosenOutcome = (
  marketPricesAndPendingOrders: MarketPricesAndPendingOrders
): ChosenOutcome | null => {
  const { marketPrices } = marketPricesAndPendingOrders;

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

const buildMarketCard = (marketData: MarketData): MarketCard => {
  const marketCard: MarketCard = {
    image: "",
    title: `Is ${marketData.outcome.marketOutcome} gonna make it against ${marketData.outcome.marketOutcomeAgainst}?`,
    id: marketData.pk,
    data: marketData,
  };
  return marketCard;
};
