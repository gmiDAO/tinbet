import { useContext } from "react";
import { UserContext } from "./state";

export const useUserContext = () => {
  return useContext(UserContext);
};
