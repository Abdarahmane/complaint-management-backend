import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createComplaint = [
    body('description').notEmpty().withMessage('Description is required'),
    body('clientId').isInt().withMessage('Client ID must be an integer'),
    body('priorityId').isInt().withMessage('Priority ID must be an integer'),
    body('categoryId').isInt().withMessage('Category ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Convertir les IDs en entiers
            const clientId = parseInt(req.body.clientId);
            const priorityId = parseInt(req.body.priorityId);
            const categoryId = parseInt(req.body.categoryId);

            // Vérifier si les IDs existent
            const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
            const priorityExists = await prisma.priority.findUnique({ where: { id: priorityId } });
            const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });

            if (!clientExists || !priorityExists || !categoryExists) {
                return res.status(404).json({ error: "One of the provided IDs does not exist." });
            }

            // Vérification du champ resolved_date
            const resolvedDate = req.body.resolved_date ? new Date(req.body.resolved_date) : null;

            const complaint = await prisma.complaint.create({
                data: {
                    description: req.body.description,
                    soumission_date: new Date(), // Date actuelle par défaut
                    statut: req.body.statut || 'En attente', // Statut par défaut
                    resolved_date: resolvedDate, // Ajout de la date résolue
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
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const complaint = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: updatedData
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
