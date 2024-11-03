import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createClient = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
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
