import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routes/product.routes.js";
import { sql } from "./config/db.js";


const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


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


// API Routes
app.use('/api/products', productRoutes);





initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on: http://localhost:${PORT}`);
    });
});