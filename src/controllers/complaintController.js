import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createComplaint = [
    // Validation des champs
    body('description')
        .notEmpty().withMessage('La description est obligatoire.')
        .isLength({ max: 255 }).withMessage('La description ne peut pas dépasser 255 caractères.'),
    body('clientId').isInt().withMessage("L'ID du client doit être un entier."),
    body('priorityId').isInt().withMessage("L'ID de la priorité doit être un entier."),
    body('categoryId').isInt().withMessage("L'ID de la catégorie doit être un entier."),
    body('resolved_date')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('La date de résolution doit être au format ISO8601.'),

    async (req, res) => {
        // Validation des erreurs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Parsing des champs pour Prisma
            const { description, clientId, priorityId, categoryId, resolved_date, userId, statut } = req.body;

            // Vérifications des relations
            const [clientExists, priorityExists, categoryExists] = await Promise.all([
                prisma.client.findUnique({ where: { id: parseInt(clientId) } }),
                prisma.priority.findUnique({ where: { id: parseInt(priorityId) } }),
                prisma.category.findUnique({ where: { id: parseInt(categoryId) } }),
            ]);

            if (!clientExists) {
                return res.status(404).json({ error: "Le client spécifié n'existe pas." });
            }
            if (!priorityExists) {
                return res.status(404).json({ error: "La priorité spécifiée n'existe pas." });
            }
            if (!categoryExists) {
                return res.status(404).json({ error: "La catégorie spécifiée n'existe pas." });
            }

            // Création de la réclamation
            const complaint = await prisma.complaint.create({
                data: {
                    description,
                    soumission_date: new Date(),
                    statut: statut || 'En attente',
                    resolved_date: resolved_date ? new Date(resolved_date) : null,
                    userId: userId ? parseInt(userId) : null,
                    clientId: parseInt(clientId),
                    priorityId: parseInt(priorityId),
                    categoryId: parseInt(categoryId),
                }
            });

            res.status(201).json(complaint);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Une erreur est survenue lors de la création de la réclamation." });
        }
    }
];

// Récupérer toutes les réclamations
export const getComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany();
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des réclamations." });
    }
};

// Récupérer une réclamation par ID
export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await prisma.complaint.findUnique({
            where: { id: parseInt(id) }
        });

        if (!complaint) {
            return res.status(404).json({ error: "La réclamation demandée est introuvable." });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la réclamation." });
    }
};

// Mettre à jour une réclamation
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, resolved_date, ...updatedData } = req.body;

        const updateFields = {
            ...updatedData,
            statut: statut || 'En attente',
            resolved_date: statut === 'Résolu' ? (resolved_date ? new Date(resolved_date) : new Date()) : null,
        };

        const complaint = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: updateFields,
        });

        res.status(200).json(complaint);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "La réclamation à mettre à jour est introuvable." });
        }
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la réclamation." });
    }
};

// Supprimer une réclamation
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.complaint.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).end();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "La réclamation à supprimer est introuvable." });
        }
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la réclamation." });
    }
};
