require('dotenv').config(); // ✅ Load .env first

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const router = require('./routes/index.js');
const setupSwagger = require('./swagger');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
setupSwagger(app);

// 🔁 Static file handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', router);

// ✅ Start server after DB connects
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('✅ Server is running on port', PORT);
  });
});
