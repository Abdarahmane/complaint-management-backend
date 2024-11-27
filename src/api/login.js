import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pkg from '@prisma/client';

dotenv.config();

const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Route pour enregistrer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    // Vérifiez que tous les champs sont fournis
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    try {
        // Vérifiez si l'email est déjà utilisé
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hachez le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créez le nouvel utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        // Retournez une réponse réussie
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// Route pour connecter un utilisateur (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier si le mot de passe est valide
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' } // Durée de validité du token
        );

        // Envoyer la réponse avec un message de succès
        res.status(200).json({
            message: 'Connexion réussie !',
            token,
            role: user.role,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            },
        });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).json({ error: 'Une erreur interne est survenue. Veuillez réessayer plus tard.' });
    }
});


// Exporter le routeur pour une utilisation dans app.js
export default router;
