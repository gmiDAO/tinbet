import { createContext, Dispatch } from "react";
import { UserAction } from "./reducer";

const DEFAULT_STAKE = 0.1;

export type UserState = {
  wallet: string;
  stake: number;
};

export const initialState: UserState = {
  wallet: "",
  stake: DEFAULT_STAKE,
};

type UserContexType = {
  user: UserState;
  dispatch: Dispatch<UserAction>;
};
export const UserContext = createContext<UserContexType>({
  user: initialState,
  dispatch: () => null,
});
