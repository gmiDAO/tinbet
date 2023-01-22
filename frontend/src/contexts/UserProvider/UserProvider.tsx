import { useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useEffect, useMemo, useReducer } from "react";
import { reducer, UserActionTypes } from "./reducer";
import { UserContext, initialState } from "./state";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = useReducer(reducer, initialState);
  const wallet = useWallet();

  const contextValue = useMemo(() => {
    return { user, dispatch };
  }, [user, dispatch]);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey?.toString()) {
      dispatch({
        type: UserActionTypes.SET_WALLET,
        payload: wallet.publicKey.toString(),
      });
    }
  }, [wallet.connected]);

  const setUserStake = (stake: number) => {
    dispatch({
      type: UserActionTypes.SET_STAKE,
      payload: stake,
    });
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      dispatch({
        type: UserActionTypes.INIT_STORED,
        payload: JSON.parse(userData),
      });
    }
  }, []);

  useEffect(() => {
    if (user !== initialState) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
