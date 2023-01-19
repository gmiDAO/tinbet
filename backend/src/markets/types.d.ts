export type ChosenOutcome = {
  marketOutcome: string;
  marketOutcomeAgainst: string;
  marketOutcomeIndex: number;
  forOutcomePrice: number;
  againstOutcomePrice: number;
};

export type MarketData = {
  pk: string;
  outcome: ChosenOutcome;
};

export type MarketCard = {
  id: string;
  title: string;
  image: string;
  data: MarketData;
};

export type Bet = {
  forOutcome: boolean;
  marketOutcome: string;
  marketOutcomeIndex: number;
  odds: number;
  stake: number;
};
