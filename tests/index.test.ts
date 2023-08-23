import { describe, expect, test, beforeAll } from "@jest/globals";
import { DateTime, Settings } from "luxon";
import { parseCollectionDay } from "../util";

describe("parseCollectionDay", () => {
  beforeAll(() => {
    const expectedNow = DateTime.local(2023, 8, 23, 12, 30);
    Settings.now = () => expectedNow.toMillis();
  });

  test("Happy path", () => {
    const actual = parseCollectionDay("Thursday, August 24");
    const expected = DateTime.local(2023, 8, 24, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });

  test("Single digit day", () => {
    const actual = parseCollectionDay("Saturday, December 2");
    const expected = DateTime.local(2023, 12, 2, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });

  test("Next year", () => {
    const actual = parseCollectionDay("Friday, January 5");
    const expected = DateTime.local(2024, 1, 5, 7);
    expect(actual.toISO()).toEqual(expected.toISO());
  });
});

describe("getWhenToPutBinsOut", () => {
  beforeAll(() => {
    const expectedNow = DateTime.local(2023, 8, 23, 12, 30);
    Settings.now = () => expectedNow.toMillis();
  });

  test("Collection day is tomorrow", () => {});
});
