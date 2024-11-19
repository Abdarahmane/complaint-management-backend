import nodemailer from 'nodemailer';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';

const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Route pour demander la réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Générer un token de réinitialisation
        const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Envoyer l'email avec le lien de réinitialisation
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params; // Token reçu en paramètre
    const { password } = req.body; // Nouveau mot de passe envoyé par le client

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        // Vérifier et décoder le token JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Rechercher l'utilisateur par ID
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mettre à jour le mot de passe dans la base de données
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'Invalid or expired token' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'An error occurred', error });
        }
    }
});

export default router;
