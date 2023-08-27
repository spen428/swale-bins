import { DateTime } from "luxon";
import parse from "node-html-parser";

export interface BinResponse {
  modified: string;
  image: string;
  bins: string[];
  collectionDay: string;
  whenToPutBinsOut: string;
}

export function getWhenToPutBinsOut(collectionDay: DateTime): string {
  const hoursUntilCollection = collectionDay.diffNow("hours").hours;
  if (hoursUntilCollection < 0) return "-";
  if (hoursUntilCollection <= 7) return "Today!";
  if (hoursUntilCollection <= 24) return "Tonight";
  if (hoursUntilCollection <= 48) {
    return collectionDay.toRelative({ unit: "hours" }) ?? "Unknown";
  }
  return collectionDay.toRelative({ unit: "days" }) ?? "Unknown";
}

export function parseCollectionDay(text: string): DateTime {
  const withoutWeekday = text.split(", ")[1];
  const collectionDate = DateTime.fromFormat(withoutWeekday, "d MMMM").plus({
    hours: 7,
  });

  if (collectionDate < DateTime.now()) {
    return collectionDate.plus({ years: 1 });
  }

  return collectionDate;
}

export function parseHtmlResponse(html: string): BinResponse {
  const root = parse(html);
  const collectionDayText = root.querySelector(".large-font")!.innerText;

  const collectionDay = parseCollectionDay(collectionDayText);

  return {
    bins: [],
    collectionDay: collectionDay.toISODate()!,
    image: "",
    modified: "",
    whenToPutBinsOut: "",
  };
}
