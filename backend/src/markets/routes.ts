import { Hono } from "hono";
import * as service from "./service";
import { Environment } from "../types";
import { cors } from "hono/cors";

const markets = new Hono<{ Bindings: Environment }>();
markets.use("/*", cors());

markets.get("/", async (c) => {
  const marketCards = await service.getMarketCards(c.env);
  return c.json({ markets: marketCards, ok: true });
});

export { markets };
