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
import { getProgram } from "../utils/solana";
import { Environment, MessageSendRequest } from "../types";
import { MarketData, ChosenOutcome, Bet, MarketCard } from "./types";
import * as model from "./model";

// const mintToken = "Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH";
const mintToken = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const mintDecimals = 6;
const marketsStatus = MarketStatus.Open;

/* 
  Deprecated in favour of updateMarketsAddresses
  Left here for example purposes
*/
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

export const getMarketCards = async (
  env: Environment
): Promise<MarketCard[] | null> => {
  const marketCards = await model.getMarketCards(env.MARKETS);
  return marketCards;
};

export const updateMarketsAndSendBatch = async (env: Environment) => {
  const marketAddresses: string[] = await updateMarketsAddresses(env);
  const batch: MessageSendRequest[] = marketAddresses.map((value) => ({
    body: JSON.stringify(value),
  }));
  // @ts-ignore
  await env.POPULATE_MARKETS.sendBatch(batch);
};

const updateMarketsAddresses = async (
  env: Environment
): Promise<string[] | null> => {
  const eventCategories = await getEventCategories(env);
  if (eventCategories) {
    const validMarketsAddresses =
      getValidMarketsAddressesFromEventCategories(eventCategories);
    await model.updateMarketAddresses(env.MARKETS, validMarketsAddresses);
    return validMarketsAddresses;
  }
  return null;
};

const getValidMarketsAddressesFromEventCategories = (
  eventCategories: any
): string[] => {
  /* 
    Returns an array of valid market addresses from event categories.
    For sake of simplicity for the hackathon, we only allow Full Time Result markets
  */
  const validMarketsAddresses: string[] = [];
  for (const eventCategory of eventCategories) {
    if (eventCategory.id === "HISTORICAL") {
      continue;
    }
    for (const eventGroup of eventCategory.eventGroup || []) {
      for (const event of eventGroup.events || []) {
        for (const market of event.markets || []) {
          if (market.marketName === "Full Time Result") {
            validMarketsAddresses.push(market.marketAccount);
          }
        }
      }
    }
  }
  return validMarketsAddresses;
};

const getEventCategories = async (env: Environment): Promise<any> => {
  /* Retrieves event categories from cache if exists or from betdex API  and updates the cache
   returns event categories */

  const eventCategoriesCached = await model.getEventCategories(env.MARKETS);
  if (eventCategoriesCached) {
    return eventCategoriesCached;
  }
  const eventCategories = await getBetDexEventCategories();
  if (eventCategories) {
    await model.updateEventCategories(env.MARKETS, eventCategories);
    return eventCategories;
  }
  return null;
};

const getBetDexEventCategories = async (): Promise<any> => {
  try {
    const resp = await fetch("https://prod.events.api.betdex.com/events");
    const data: any = await resp.json();
    return data?.eventCategories || [];
  } catch (e) {
    console.log("Error getting betdex events", e);
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
    // skip Draw market outcome just for simplicity for the hackathon
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
