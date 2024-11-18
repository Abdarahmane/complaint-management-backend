import express from 'express';
import pkg from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors'; // Importer cors

// Import routes
import userRoutes from './src/routes/userRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import priorityRoutes from './src/routes/priorityRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import complaintRoutes from './src/routes/complaintRoutes.js';
import loginRouter from './src/api/login.js'; // Assurez-vous d'importer le bon fichier

// Import authentication middleware
import { authenticateUser } from './src/middlewares/authentication.js';

dotenv.config();
const app = express();
const { PrismaClient } = pkg;

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend si nécessaire
  credentials: true, // Si vous utilisez des cookies ou des sessions
}));

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Routes pour l'authentification
app.use('/auth', loginRouter);

// Routes protégées pour chaque entité
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/priorities', priorityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);

// Gestion des erreurs pour les routes non définies
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal error occurred' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
