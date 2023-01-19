import type { NextPage } from "next";
import Head from "next/head";
import { TinderCard } from "components/TinderCard";
import { useState, useEffect } from "react";
import { useFetchMarkets } from "lib/markets/hook";
import { Bet, placeBet } from "lib/markets/api";
import { useProgram } from "contexts/ProgramProvider";
import { AnchorProvider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

const HomePage: NextPage = (props) => {
  const markets = useFetchMarkets();
  const [cards, setCards] = useState([]);
  const program = useProgram();
  const wallet = useWallet();

  const removeCard = (card: any) => {
    setCards((prevCards) =>
      prevCards.filter((prevCard: TinderCard) => prevCard.id !== card.id)
    );
  };

  const onSwipeHandler = async (direction: "left" | "right", card: any) => {
    // remove the card from the cards array
    removeCard(card);
    console.log("swipe", direction, card);
    const forOutcome = direction === "right";
    const price =
      card.data.prices[forOutcome ? "againstOutcomePrice" : "forOutcomePrice"]; // Use the opposite price to match the position
    const bet: Bet = {
      forOutcome: forOutcome,
      odds: price,
      stake: 0.1,
      marketOutcome: card.data.prices.marketOutcome,
      marketOutcomeIndex: card.data.prices.marketOutcomeIndex,
    };
    console.log("bet", bet);
    const betResult = await placeBet(program, card.data.market, bet);
    console.log("betResult", betResult);
  };

  const onSkipHandler = (card: any) => {
    removeCard(card);
  };

  const buildMarketCards = (markets: any) => {
    const marketCards = markets.map((marketData: any) => {
      const card: TinderCard = {
        image: "",
        text: `Are ${marketData.prices.marketOutcome} gonna make it against ${marketData.prices.marketOutcomeAgainst}?`,
        id: marketData.market.publicKey.toString(),
        data: marketData,
      };
      return card;
    });
    return marketCards;
  };

  useEffect(() => {
    console.log("markets", markets);
    if (markets && markets.length) {
      const marketCards = buildMarketCards(markets);
      console.log("marketCards", marketCards);
      setCards(marketCards);
    }
  }, [markets]);

  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    console.log("wallet.publicKey", wallet.publicKey);
    const provider = program.provider as AnchorProvider;
    console.log(provider.wallet.publicKey);
  }, [wallet.publicKey]);

  return (
    <>
      <Head>
        <title>🔥 Tindbet</title>
      </Head>

      {cards.map((card, index) => {
        return (
          <>
            <TinderCard
              key={index}
              card={card}
              onSwipe={onSwipeHandler}
              onSkip={onSkipHandler}
            />
          </>
        );
      })}

      <p>Total Cards Left {cards.length}</p>
    </>
  );
};

export default HomePage;
