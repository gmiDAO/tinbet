import { Hono } from "hono";
import * as model from "./model";
import { Environment } from "../types";
import { cors } from "hono/cors";

const markets = new Hono<{ Bindings: Environment }>();
markets.use("/*", cors());

markets.get("/", async (c) => {
  const marketCards = await model.getMarketCards(c.env.MARKETS);
  return c.json({ markets: marketCards, ok: true });
});

export { markets };
