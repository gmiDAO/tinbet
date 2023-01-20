import type { NextPage } from "next";
import Head from "next/head";
import { TinderCard } from "components/TinderCard";
import { useState, useEffect } from "react";
import { Bet, getMarketCards, placeBet } from "lib/markets/api";
import { useProgram } from "contexts/ProgramProvider";

const HomePage: NextPage = (props) => {
  const [cards, setCards] = useState([]);
  const program = useProgram();

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
      card.data.outcome[forOutcome ? "againstOutcomePrice" : "forOutcomePrice"]; // Use the opposite price to match the position
    const bet: Bet = {
      forOutcome: forOutcome,
      odds: price,
      stake: 0.1,
      marketOutcome: card.data.outcome.marketOutcome,
      marketOutcomeIndex: card.data.outcome.marketOutcomeIndex,
    };
    console.log("bet", bet);
    const betResult = await placeBet(program, card.data.pk as string, bet);
    console.log("betResult", betResult);
  };

  const onSkipHandler = (card: any) => {
    removeCard(card);
  };

  useEffect(() => {
    if (cards.length === 0) {
      getMarketCards().then((cards) => {
        setCards(cards.markets);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>🔥 Tindbet</title>
      </Head>

      {cards.map((card, index) => {
        return (
          <TinderCard
            key={index}
            card={card}
            onSwipe={onSwipeHandler}
            onSkip={onSkipHandler}
          />
        );
      })}

      <p>Total Cards Left {cards.length}</p>
    </>
  );
};

export default HomePage;
