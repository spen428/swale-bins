import { beforeAll, describe, expect, test } from "@jest/globals";
import { DateTime, Settings } from "luxon";
import {
  BinResponse,
  getWhenToPutBinsOut,
  parseCollectionDay,
  parseHtmlResponse,
} from "../util";
import * as fs from "fs";
import path from "path";

const now = DateTime.local(2023, 8, 23, 12, 30);

describe("parseCollectionDay", () => {
  beforeAll(() => {
    Settings.now = () => now.toMillis();
  });

  test("Happy path", () => {
    const actual = parseCollectionDay("Thursday, 24 August");
    const expected = DateTime.local(2023, 8, 24, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });

  test("Single digit day", () => {
    const actual = parseCollectionDay("Saturday, 2 December");
    const expected = DateTime.local(2023, 12, 2, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });

  test("Next year", () => {
    const actual = parseCollectionDay("Friday, 5 January");
    const expected = DateTime.local(2024, 1, 5, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });
});

describe("getWhenToPutBinsOut", () => {
  const collectionDay = DateTime.local(2023, 8, 24, 7);

  test("Collection day is tomorrow", () => {
    const now = DateTime.local(2023, 8, 23, 19).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("Tonight");
  });

  test("Collection day is today", () => {
    const now = DateTime.local(2023, 8, 24, 0, 1).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("Today!");
  });

  test("Collection day was today", () => {
    const now = DateTime.local(2023, 8, 24, 7, 1).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("-");
  });

  test("Collection day is in 48 hours", () => {
    const now = DateTime.local(2023, 8, 22, 7).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 48 hours");
  });

  test("Collection day is more than 48 hours away", () => {
    const now = DateTime.local(2023, 8, 22, 6).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 2 days");
  });

  test("Collection day is more than a week away", () => {
    const now = DateTime.local(2023, 8, 17, 2).toMillis();
    Settings.now = () => now;
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 7 days");
  });
});

describe("parseHtmlResponse", () => {
  const testFile = path.join(__dirname, "./", "page.html");
  const html = fs.readFileSync(testFile, "utf8");

  test("Happy path", () => {
    const actual = parseHtmlResponse(html);
    const expected: BinResponse = {
      bins: [],
      collectionDay: "2023-08-31",
      image: "",
      modified: "",
      whenToPutBinsOut: "",
    };
    expect(actual).toEqual(expected);
  });

  test("Website structure has changed", () => {});
});
