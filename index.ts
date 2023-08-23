import express from "express";
import {getWhenToPutBinsOut, parseCollectionDay} from "./util";

const app = express();

app.get('/', function (req, res) {
    const collectionDay = parseCollectionDay("Thursday, August 24");
    const body = {
        modified: new Date().toISOString(),
        image: "/bins_1.jpg",
        bins: [
            "Green",
            "Black and orange"
        ],
        collectionDay: collectionDay.toISODate(),
        whenToPutBinsOut: getWhenToPutBinsOut(collectionDay),
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
});

app.listen("8199", () => console.log(`Server is running`));
