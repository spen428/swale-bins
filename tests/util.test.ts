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

function setMockNow(date: DateTime) {
  Settings.now = () => date.toMillis();
}

const now = DateTime.local(2023, 8, 23, 12, 30);

describe("parseCollectionDay", () => {
  beforeAll(() => setMockNow(now));

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
    setMockNow(DateTime.local(2023, 8, 23, 19));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("tonight");
  });

  test("Collection day is today", () => {
    setMockNow(DateTime.local(2023, 8, 24, 0, 1));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("now!");
  });

  test("Collection day was today", () => {
    setMockNow(DateTime.local(2023, 8, 24, 7, 1));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("-");
  });

  test("Collection day is in 48 hours", () => {
    setMockNow(DateTime.local(2023, 8, 22, 7));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 48 hours");
  });

  test("Collection day is more than 48 hours away", () => {
    setMockNow(DateTime.local(2023, 8, 22, 6));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 2 days");
  });

  test("Collection day is more than a week away", () => {
    setMockNow(DateTime.local(2023, 8, 17, 2));
    expect(getWhenToPutBinsOut(collectionDay)).toEqual("in 7 days");
  });
});

describe("parseHtmlResponse", () => {
  beforeAll(() => setMockNow(now));

  const testFile = path.join(__dirname, "./", "page.html");
  const html = fs.readFileSync(testFile, "utf8");

  test("Happy path", () => {
    const actual = parseHtmlResponse(html);
    const expected: BinResponse = {
      collectionDay: "2023-08-31",
      lastModifiedTimestamp: now.toMillis(),
      bins: [
        "Orange and black bin (food waste)",
        "Brown bin (garden waste)",
        "Blue bin or clear sacks (recycling)",
        "Textiles (place in a carrier bag next to your bin)",
      ],
      image: "recycling.jpg",
      whenToPutBinsOut: "in 7 days",
      announcements:
        "Our offices are closed this bank holiday Monday, 28 August. If your bin is due to be collected, leave it out as usual and we'll collect it as soon as we can.",
    };
    expect(actual).toEqual(expected);
  });

  test("Website structure has changed", () => {});
});
