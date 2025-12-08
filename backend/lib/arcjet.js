import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";


// init arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protect your app from common attacks e.g. SQL injection, XSS, CSRF attacks
        shield({mode:"LIVE"}),
        detectBot({
            mode: "LIVE", // Block all bots exccept search engine
            allow: [
                "CATEGORY:SEARCH_ENGINE" // see the full list at https://arcjet.com/bot-list
            ]
        }),

        // rate limit
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        })
    ]
});