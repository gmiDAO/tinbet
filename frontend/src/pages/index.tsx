import type { NextPage } from "next";
import Head from "next/head";
import { TinderCard } from "components/TinderCard";
import { useState, useEffect } from "react";
import { Bet, getMarketCards, placeBet } from "lib/markets/api";
import { useProgram } from "contexts/ProgramProvider";
import { useFetchMarketCards } from "lib/markets/hook";
import Modal from "components/Modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";

type HomePageProps = {
  marketCards: any[];
};
const HomePage: NextPage<HomePageProps> = ({ marketCards }) => {
  const [cards, setCards] = useState(marketCards);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const program = useProgram();
  const wallet = useWallet();

  const removeCard = (card: any) => {
    setCards((prevCards) =>
      prevCards.filter((prevCard: TinderCard) => prevCard.id !== card.id)
    );
  };

  const onSwipeHandler = async (direction: "left" | "right", card: any) => {
    // remove the card from the cards array
    if (!wallet.connected) {
      setIsOpenModal(true);
    } else {
      removeCard(card);
      console.log("swipe", direction, card);
      const forOutcome = direction === "right";
      const price =
        card.data.outcome[
          forOutcome ? "againstOutcomePrice" : "forOutcomePrice"
        ]; // Use the opposite price to match the position
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
    }
  };

  const onSkipHandler = (card: any) => {
    removeCard(card);
  };

  return (
    <>
      <Head>
        <title>Tinbet</title>
      </Head>
      <Modal setIsOpen={setIsOpenModal} isOpen={isOpenModal}>
        <div className="card  bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center">Connect Wallet!</h2>
            <p>You need to connect a Solana Wallet to place bets</p>
            <div
              className="card-actions justify-center"
              onClick={() => setIsOpenModal(false)}
            >
              <WalletMultiButtonDynamic />
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col items-center justify-center px-5 py-2">
        <p className="text-2xl">Swipe righ or left to bet!</p>
        <p className="text-md">all bets are in USDT</p>

        <div
          className="flex justify-center py-2 mt-2"
          style={{ height: "600px" }}
        >
          <div className="relative w-80">
            {cards.map((card, index) => {
              return (
                <div
                  className="absolute inset-0 flex justify-center items-start"
                  key={index}
                >
                  <TinderCard
                    card={card}
                    onSwipe={onSwipeHandler}
                    onSkip={onSkipHandler}
                    canSwipe={wallet.connected}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const marketCards = await getMarketCards();
  return {
    props: {
      marketCards: marketCards ? marketCards.markets : [],
    },
    revalidate: 600, // In seconds
  };
}

export default HomePage;
