import {describe, expect, test} from '@jest/globals';
import {DateTime} from "luxon";
import {parseCollectionDay} from "../util";

describe("parseCollectionDay", () => {
    test('Happy path', () => {
        const actual = parseCollectionDay("Thursday, August 24");
        const expected = DateTime.fromObject({
            year: DateTime.now().year,
            month: 8,
            day: 24,
            hour: 7
        });
        expect(actual.toISO()).toEqual(expected.toISO());
    });

    test('Single digit day', () => {
        const actual = parseCollectionDay("Saturday, December 2");
        const expected = DateTime.fromObject({
            year: DateTime.now().year,
            month: 12,
            day: 2,
            hour: 7
        });
        expect(actual.toISO()).toEqual(expected.toISO());
    });

    test('Next year', () => {
        const actual = parseCollectionDay("Friday, January 5");
        const expected = DateTime.fromObject({
            year: DateTime.now().year + 1,
            month: 1,
            day: 5,
            hour: 7
        });
        expect(actual.toISO()).toEqual(expected.toISO());
    });
})