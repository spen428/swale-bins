import {DateTime} from "luxon";

export function getWhenToPutBinsOut(collectionDay: DateTime): string {
    const hoursUntilCollection = collectionDay.diffNow("hours").hours;
    if (hoursUntilCollection < 0) return "-";
    if (hoursUntilCollection <= 7) return "Today!";
    if (hoursUntilCollection <= 24) return "Tonight";
    if (hoursUntilCollection <= 48) {
        return collectionDay.toRelative({unit: "hours"}) ?? "Unknown";
    }
    return collectionDay.toRelative({unit: "days"}) ?? "Unknown";
}

export function parseCollectionDay(text: string): DateTime {
    const withoutWeekday = text.split(", ")[1];
    const collectionDate = DateTime.fromFormat(withoutWeekday, "MMMM d")
        .plus({hours: 7});

    if (collectionDate < DateTime.now()) {
        return collectionDate.plus({years: 1});
    }

    return collectionDate;
}