import express from "express";
import { parseHtmlResponse } from "./util";

const app = express();

app.get("/", function (req, res) {
  const body = parseHtmlResponse("");

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
});

app.listen("8199", () => console.log(`Server is running`));
