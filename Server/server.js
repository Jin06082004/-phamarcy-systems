/** @format */

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";  // Thêm dòng này
import { connectDB } from "./src/dbConfig.js";
import drugRouter from "./routers/drugRoutes.js";
import categoryRouter from "./routers/categoryRoutes.js";
import inventoryRouter from './routers/inventoryRoutes.js';
import invoiceRouter from './routers/invoiceRoutes.js';
import prescriptionRouter from './routers/prescriptionRoutes.js';
import userRouter from './routers/userRoutes.js';
import ordersRouter from './routers/ordersRouter.js';
import discountRouter from "./routers/discountRouters.js";
import cartRouter from "./routers/cartRoutes.js";
import couponRouter from "./routers/couponRoutes.js";

const app = express();

// Thêm CORS middleware TRƯỚC các route
// Configure CORS to allow local development origins and handle preflight properly
const allowedOrigins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5500",
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like curl, server-to-server)
        if (!origin) return callback(null, true);
        // allow if origin is in allowed list or is localhost with any port
        if (allowedOrigins.indexOf(origin) !== -1 || /^(https?:\/\/localhost(:\d+)?|https?:\/\/127\.0\.0\.1(:\d+)?)/.test(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Set CORS response headers explicitly for extra compatibility
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.indexOf(origin) !== -1 || /^(https?:\/\/localhost(:\d+)?|https?:\/\/127\.0\.0\.1(:\d+)?)/.test(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    }
    next();
});

// Body parsers: JSON, urlencoded and a text fallback for requests missing Content-Type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// If body was parsed as text (fallback), try to parse as JSON so req.body becomes an object
app.use((req, res, next) => {
    if (typeof req.body === 'string') {
        const s = req.body.trim();
        if (s.length === 0) {
            req.body = {};
        } else {
            try {
                req.body = JSON.parse(s);
            } catch (e) {
                // leave as string if not JSON
            }
        }
    }
    next();
});

// Mount routers after body parsers
app.use("/drugs", drugRouter);
app.use("/categories", categoryRouter);
app.use('/inventories', inventoryRouter);
app.use('/invoices', invoiceRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/users', userRouter);
app.use('/orders', ordersRouter);
app.use("/discounts", discountRouter);
app.use("/carts", cartRouter);
app.use("/coupons", couponRouter);

app.get('/', (req, res) => res.send('Pharmacy management server is running'));

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, (error) => {
            if (error) {
                console.error('Error listen starting the server', error);
            } else {
                console.log(`Server is running on http://localhost:${PORT}`);
            }
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });