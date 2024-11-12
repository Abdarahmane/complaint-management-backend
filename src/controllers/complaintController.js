import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createComplaint = [
    body('description').notEmpty().withMessage('Description is required').isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters'),
    body('clientId').isInt().withMessage('Client ID must be an integer'),
    body('priorityId').isInt().withMessage('Priority ID must be an integer'),
    body('categoryId').isInt().withMessage('Category ID must be an integer'),
    body('resolved_date').optional({ checkFalsy: true }).isISO8601().withMessage('Resolved date must be a valid ISO8601 date'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const clientId = parseInt(req.body.clientId);
            const priorityId = parseInt(req.body.priorityId);
            const categoryId = parseInt(req.body.categoryId);

            const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
            const priorityExists = await prisma.priority.findUnique({ where: { id: priorityId } });
            const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });

            if (!clientExists || !priorityExists || !categoryExists) {
                return res.status(404).json({ error: "One of the provided IDs does not exist." });
            }

            const complaint = await prisma.complaint.create({
                data: {
                    description: req.body.description,
                    soumission_date: new Date(), // Date actuelle
                    statut: req.body.statut || 'En attente', // Statut par défaut
                    resolved_date: req.body.resolved_date ? new Date(req.body.resolved_date) : null, // Date résolue si fournie
                    userId: req.body.userId ? parseInt(req.body.userId) : null, // userId est facultatif
                    clientId: clientId,
                    priorityId: priorityId,
                    categoryId: categoryId,
                }
            });
            res.status(201).json(complaint);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the complaint." });
        }
    }
];



// Récupérer toutes les réclamations
export const getComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une réclamation par ID
export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await prisma.complaint.findUnique({
            where: { id: parseInt(id) }
        });
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({ error: "Complaint not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une réclamation
// Mettre à jour une réclamation
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, resolved_date, ...updatedData } = req.body;

        // Définir les données de mise à jour
        const updateFields = {
            ...updatedData,
            statut: statut || 'En attente',
            resolved_date: statut === 'Résolu' ? (resolved_date ? new Date(resolved_date) : new Date()) : null
        };

        const complaint = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: updateFields
        });

        res.status(200).json(complaint);
    } catch (error) {
        if (error.code === 'P2025') {
            // Erreur spécifique à Prisma pour indiquer que la réclamation n'existe pas
            return res.status(404).json({ error: "Complaint not found" });
        }
        res.status(500).json({ error: error.message });
    }
};


// Supprimer une réclamation
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.complaint.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Complaint not found" });
        }
        res.status(500).json({ error: error.message });
    }
};
