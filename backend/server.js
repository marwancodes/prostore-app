import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routes/product.routes.js"


const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API Routes
app.use('/api/products', productRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});