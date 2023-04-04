import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express();
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import convRoute from './routes/conversations.js';
import msgRoute from './routes/messages.js';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log('Connected to mongoDB');
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json('file uploaded successfully.');
  } catch (error) {
    console.log(error);
  }
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', convRoute);
app.use('/api/messages', msgRoute);

app.listen(5000, () => {
  console.log('Listening to port 5000');
});
