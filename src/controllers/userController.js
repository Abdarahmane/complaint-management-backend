import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { sendWelcomeEmail } from '../services/emailService.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Création d'un nouvel utilisateur avec validation
export const createUser = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['admin', 'employer']).withMessage('Role must be either admin or employer'),
    body('name').notEmpty().withMessage('Name is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password, role, name } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" });
            }

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    name
                }
            });

            // Envoi de l'email de bienvenue
            await sendWelcomeEmail(email, name);

            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the user." });
        }
    }
];

// Récupération de tous les utilisateurs avec pagination
export const getUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            skip: parseInt(skip),
            take: parseInt(limit)
        });
        const totalUsers = await prisma.user.count();

        res.status(200).json({
            data: users,
            total: totalUsers,
            page: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Récupération d'un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Mise à jour d'un utilisateur par ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, role, name } = req.body;

        const dataToUpdate = {
            email,
            role: role === "admin" ? "admin" : "employer",
            name
        };

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        // Vérification si l'email est déjà utilisé par un autre utilisateur
        if (existingUser && existingUser.id !== parseInt(id)) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Suppression d'un utilisateur par ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
