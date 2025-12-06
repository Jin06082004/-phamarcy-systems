/** @format */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
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
import uploadRouter from './routers/uploadRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files từ thư mục Web/shared
app.use('/shared', express.static(path.join(__dirname, '../Web/shared')));

// Configure CORS
const allowedOrigins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5500",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
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

// Set CORS headers explicitly
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

// Mount upload router TRƯỚC body parsers (vì multer cần xử lý multipart/form-data)
app.use("/uploads", uploadRouter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: '*/*' }));

// Parse text body as JSON if possible
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

// Mount API routers with /api prefix
app.use("/api/drugs", drugRouter);
app.use("/api/categories", categoryRouter);
app.use('/api/inventories', inventoryRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/prescriptions', prescriptionRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', ordersRouter);
app.use("/api/discounts", discountRouter);
app.use("/api/carts", cartRouter);
app.use("/api/coupons", couponRouter);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Pharmacy management server is running',
        status: 'OK',
        timestamp: new Date().toISOString(),
        endpoints: {
            drugs: '/api/drugs',
            categories: '/api/categories',
            orders: '/api/orders',
            users: '/api/users',
            invoices: '/api/invoices',
            uploads: '/uploads/drug-image'
        }
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, (error) => {
            if (error) {
                console.error('❌ Error starting the server:', error);
            } else {
                console.log('='.repeat(70));
                console.log('🏥 PHARMACY MANAGEMENT SYSTEM - SERVER');
                console.log('='.repeat(70));
                console.log(`✅ Server running at: http://localhost:${PORT}`);
                console.log(`📁 Static files: /shared`);
                console.log(`🖼️  Upload endpoint: POST /uploads/drug-image`);
                console.log(`🧪 Test endpoint: GET /test`);
                console.log(`🌐 CORS: Enabled for development origins`);
                console.log(`📊 Database: MongoDB connected`);
                console.log('='.repeat(70));
                console.log('\n📋 Available Routes:');
                console.log('   - GET    /drugs             (Get all drugs)');
                console.log('   - POST   /drugs/add         (Add new drug)');
                console.log('   - PUT    /drugs/:id         (Update drug)');
                console.log('   - DELETE /drugs/:id         (Delete drug)');
                console.log('   - GET    /categories        (Get all categories)');
                console.log('   - GET    /orders            (Get all orders)');
                console.log('   - POST   /uploads/drug-image (Upload drug image)');
                console.log('='.repeat(70));
            }
        });
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error);
        console.error('💡 Tip: Check your .env file for correct MongoDB credentials');
        process.exit(1);
    });