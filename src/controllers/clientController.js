import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createClient = [
    // Validation pour le champ 'name'
    body('name')
        .notEmpty()
        .withMessage('Le nom est obligatoire.')
        .bail()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
        .withMessage('Le nom contient des caractères invalides.')
        .bail()
        .isLength({ min: 2 })
        .withMessage('Le nom doit comporter au moins 2 caractères.')
        .bail(),
    
    // Validation pour le champ 'telephone'
    body('telephone')
        .notEmpty()
        .withMessage('Le numéro de téléphone est obligatoire.')
        .bail()
        .matches(/^[0-9]+$/)
        .withMessage('Le numéro de téléphone contient des caractères invalides.')
        .bail()
        .isLength({ min: 8, max: 15 })
        .withMessage('Le numéro de téléphone doit avoir entre 8 et 15 caractères.')
        .bail()
        .custom(async value => {
            const clientExistant = await prisma.client.findUnique({
                where: { telephone: value }
            });
            if (clientExistant) {
                throw new Error('Ce numéro de téléphone est déjà utilisé.');
            }
            return true;
        }),

    // Fonction pour traiter la requête après la validation
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const client = await prisma.client.create({
                data: req.body
            });
            res.status(201).json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the client." });
        }
    }
];

// Récupérer tous les clients
export const getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un client par ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.findUnique({
            where: { id: parseInt(id) }
        });
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: "Client not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un client
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.client.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
