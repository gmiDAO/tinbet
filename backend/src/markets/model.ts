import { MarketCard } from "./types";

const MARKETS_KEY = "MARKETS";
const MARKET_CARDS_KEY = "MARKET_CARDS";
const BASE_EXPIRATION_TTL = 660; // 11 minutes (Cron updates market cards every 10 minutes)

export const getMarketCards = async (
  KV: KVNamespace
): Promise<MarketCard[]> => {
  try {
    // First check if we have the market cards cached
    const cachedMarketCards = await KV.get(MARKET_CARDS_KEY, "json");
    if (cachedMarketCards) {
      return cachedMarketCards as MarketCard[];
    }

    // If not, get the market addresses and build the market cards
    const marketAddresses: string[] = await KV.get(MARKETS_KEY, "json");
    let marketCards: MarketCard[] = [];
    if (marketAddresses) {
      for (let i = 0; i < marketAddresses.length; i++) {
        const value = await KV.get(marketAddresses[i], "json");
        if (value) {
          marketCards.push(value as MarketCard);
        }
      }
      // Cache the market cards, only if we have any
      if (marketCards) {
        await KV.put(MARKET_CARDS_KEY, JSON.stringify(marketCards), {
          expirationTtl: BASE_EXPIRATION_TTL + 60, // 2 minutes after new cards, 1 minute after old cards have expired
        });
      }
    }
    return marketCards;
  } catch (e) {
    console.log("Error getting market cards", e);
  }
};

export const updateMarketCard = async (
  KV: KVNamespace,
  marketCard: MarketCard
): Promise<void> => {
  if (!marketCard) return;
  await KV.put(marketCard.id, JSON.stringify(marketCard), {
    expirationTtl: BASE_EXPIRATION_TTL, // 1 minute after new cards have started caching
  });
};

export const updateMarketAddresses = async (
  KV: KVNamespace,
  marketAddresses: string[]
): Promise<void> => {
  if (!marketAddresses) return;
  await KV.put(MARKETS_KEY, JSON.stringify(marketAddresses));
};
