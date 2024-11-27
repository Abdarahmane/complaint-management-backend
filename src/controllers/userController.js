import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Middleware de validation des entrées
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));
        return res.status(400).json({
            status: 'error',
            message: 'Des erreurs de validation ont été rencontrées.',
            details: formattedErrors,
        });
    }
    next();
};

// **1. Création d'un utilisateur**
// **1. Création d'un utilisateur**
export const createUser = [
    body('email')
        .isEmail()
        .withMessage('L\'email doit être valide.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    body('role')
        .isIn(['admin', 'employer'])
        .withMessage('Le rôle doit être "admin" ou "employer".'),
    body('name')
        .notEmpty()
        .withMessage('Le nom est obligatoire.')
        .isAlpha('fr-FR', { ignore: ' ' })
        .withMessage('Le nom ne doit contenir que des lettres.'),
    validateInputs,
    async (req, res) => {
        const { email, password, role, name } = req.body;

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cet email est déjà utilisé par un autre compte.',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { email, password: hashedPassword, role, name },
            });

            res.status(201).json({
                status: 'success',
                message: 'Utilisateur créé avec succès.',
                data: user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Une erreur interne est survenue lors de la création de l\'utilisateur.',
            });
        }
    },
];

// **2. Mise à jour d'un utilisateur (sans modification du mot de passe)**
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


// **3. Suppression d'un utilisateur**
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé.',
            });
        }

        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(200).json({
            status: 'success',
            message: 'Utilisateur supprimé avec succès.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Une erreur interne est survenue lors de la suppression de l\'utilisateur.',
        });
    }
};

// **4. Obtenir un utilisateur par ID**
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé.',
            });
        }

        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Une erreur interne est survenue lors de la récupération de l\'utilisateur.',
        });
    }
};

// **5. Obtenir tous les utilisateurs**
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({
            status: 'success',
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Une erreur interne est survenue lors de la récupération des utilisateurs.',
        });
    }
};
