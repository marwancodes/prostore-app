import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import path from "path";


import productRoutes from "./routes/product.routes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));

// console.log("NODE_ENV:", process.env.NODE_ENV);

const initDB = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log('Database initialized successfully');
    } catch (error) {
        console.log("Error initDB", error);
    }
};

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });
    
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots (when bot try to act like not bot)
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});


// API Routes
app.use('/api/products', productRoutes);


// if (process.env.NODE_ENV === "production") {
//   // server our react app
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // serve React app for any unmatched request without using path-to-regexp
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}



app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    initDB();
});
