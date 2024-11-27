import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Créer un client
// Créer un client
export const createClient = [
    body('name')
        .notEmpty()
        .withMessage('Le champ "Nom" est requis.')
        .matches(/^[a-zA-ZÀ-ÿ\s\-]+$/)
        .withMessage('Le nom ne doit contenir que des lettres, des espaces ou des tirets.'),
    body('email')
        .isEmail()
        .withMessage('Le format de l\'email est invalide.')
        .custom(async (value) => {
            const existingEmail = await prisma.client.findUnique({
                where: { email: value },
            });
            if (existingEmail) {
                throw new Error('L\'email est déjà utilisé.');
            }
        }),
    body('phone')
        .notEmpty()
        .withMessage('Le champ "Téléphone" est requis.')
        .matches(/^\d+$/)
        .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres.')
        .isLength({ min: 8, max: 15 })
        .withMessage('Le numéro de téléphone doit comporter entre 8 et 15 chiffres.')
        .custom(async (value) => {
            const existingPhone = await prisma.client.findUnique({
                where: { phone: value },
            });
            if (existingPhone) {
                throw new Error('Le numéro de téléphone est déjà utilisé.');
            }
        }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erreurs: errors.array() });
        }

        try {
            const client = await prisma.client.create({
                data: req.body,
            });
            res.status(201).json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erreur: 'Une erreur s\'est produite lors de la création du client.' });
        }
    }
];

// Mettre à jour un client
export const updateClient = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Le champ "Nom" ne doit pas être vide.')
        .matches(/^[a-zA-ZÀ-ÿ\s\-]+$/)
        .withMessage('Le nom ne doit contenir que des lettres, des espaces ou des tirets.'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Le format de l\'email est invalide.')
        .custom(async (value, { req }) => {
            const existingEmail = await prisma.client.findUnique({
                where: { email: value },
            });
            if (existingEmail && existingEmail.id !== parseInt(req.params.id)) {
                throw new Error('L\'email est déjà utilisé.');
            }
        }),
    body('phone')
        .optional()
        .matches(/^\d+$/)
        .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres.')
        .isLength({ min: 8, max: 15 })
        .withMessage('Le numéro de téléphone doit comporter entre 8 et 15 chiffres.')
        .custom(async (value, { req }) => {
            const existingPhone = await prisma.client.findUnique({
                where: { phone: value },
            });
            if (existingPhone && existingPhone.id !== parseInt(req.params.id)) {
                throw new Error('Le numéro de téléphone est déjà utilisé.');
            }
        }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erreurs: errors.array() });
        }

        try {
            const { id } = req.params;
            const existingClient = await prisma.client.findUnique({
                where: { id: parseInt(id) },
            });
            if (!existingClient) {
                return res.status(404).json({ erreur: 'Client introuvable.' });
            }

            const updatedClient = await prisma.client.update({
                where: { id: parseInt(id) },
                data: req.body,
            });
            res.status(200).json(updatedClient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erreur: 'Une erreur s\'est produite lors de la mise à jour du client.' });
        }
    }
];

// Récupérer tous les clients
export const getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ erreur: 'Une erreur s\'est produite lors de la récupération des clients.' });
    }
};

// Récupérer un client par ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: { id: parseInt(id) },
        });
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ erreur: 'Client introuvable.' });
        }
    } catch (error) {
        res.status(500).json({ erreur: 'Une erreur s\'est produite lors de la récupération du client.' });
    }
};

// Supprimer un client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.client.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ erreur: 'Une erreur s\'est produite lors de la suppression du client.' });
    }
};
