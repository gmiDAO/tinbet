import { initialState, UserState } from "./state";

export enum UserActionTypes {
  INIT_STORED = "INIT_STORED",
  SET_STAKE = "SET_STAKE",
  SET_WALLET = "SET_WALLET",
  CLEAR_USER = "CLEAR_USER",
}

type SetUserAction = {
  type:
    | UserActionTypes.SET_STAKE
    | UserActionTypes.SET_WALLET
    | UserActionTypes.INIT_STORED;
  payload: any;
};

type ClearUser = {
  type: UserActionTypes.CLEAR_USER;
};

export type UserAction = SetUserAction | ClearUser;

export const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.INIT_STORED:
      return action.payload;
    case UserActionTypes.SET_WALLET:
      return { ...state, wallet: action.payload };
    case UserActionTypes.SET_STAKE:
      return { ...state, stake: action.payload };
    case UserActionTypes.CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};
