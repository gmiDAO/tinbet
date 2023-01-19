import { useProgram } from "contexts/ProgramProvider";
import { useEffect, useState } from "react";
import { getMarkets } from "./api";

export const useFetchMarkets = () => {
  const program = useProgram();
  const [markets, setMarkets] = useState<any>([]);
  useEffect(() => {
    if (program) {
      getMarkets(program).then((marketsData) => {
        setMarkets(marketsData);
      });
    }
  }, [program]);

  return markets;
};
