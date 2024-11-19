import pkg from '@prisma/client';
import { body, validationResult, param } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Middleware pour traiter les erreurs de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Création d'une priorité avec validation
export const createPriority = [
    body('name')
        .notEmpty()
        .withMessage('Le nom de la priorité est obligatoire.')
        .isString()
        .withMessage('Le nom de la priorité doit être une chaîne de caractères.')
        .isLength({ max: 50 })
        .withMessage('Le nom de la priorité ne peut pas dépasser 50 caractères.'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { name } = req.body;

            // Vérification si le nom existe déjà
            const existingPriority = await prisma.priority.findUnique({
                where: { name },
            });

            if (existingPriority) {
                return res
                    .status(409)
                    .json({ error: 'Une priorité avec ce nom existe déjà.' });
            }

            const priority = await prisma.priority.create({
                data: { name },
            });
            res.status(201).json(priority);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Une erreur s'est produite lors de la création de la priorité.",
            });
        }
    },
];

// Récupérer toutes les priorités
export const getPriorities = async (req, res) => {
    try {
        const priorities = await prisma.priority.findMany();
        res.status(200).json(priorities);
    } catch (error) {
        res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des priorités.",
        });
    }
};

// Récupérer une priorité par ID avec validation
export const getPriorityById = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const priority = await prisma.priority.findUnique({
                where: { id: parseInt(id) },
            });

            if (priority) {
                res.status(200).json(priority);
            } else {
                res.status(404).json({ error: 'Priorité non trouvée.' });
            }
        } catch (error) {
            res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération de la priorité.",
            });
        }
    },
];

// Mise à jour d'une priorité avec validation
export const updatePriority = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    body('name')
        .notEmpty()
        .withMessage('Le champ "name" ne doit pas être vide.')
        .isString()
        .withMessage('Le nom de la priorité doit être une chaîne de caractères.')
        .isLength({ max: 50 })
        .withMessage('Le nom de la priorité ne peut pas dépasser 50 caractères.'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const existingPriority = await prisma.priority.findUnique({
                where: { id: parseInt(id) },
            });

            if (!existingPriority) {
                return res.status(404).json({ error: 'Priorité non trouvée.' });
            }

            const updatedPriority = await prisma.priority.update({
                where: { id: parseInt(id) },
                data: { name },
            });

            res.status(200).json(updatedPriority);
        } catch (error) {
            res.status(500).json({
                error: "Une erreur s'est produite lors de la mise à jour de la priorité.",
            });
        }
    },
];

// Suppression d'une priorité avec validation et gestion des réclamations liées
export const deletePriority = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;

            const existingPriority = await prisma.priority.findUnique({
                where: { id: parseInt(id) },
            });

            if (!existingPriority) {
                return res.status(404).json({ error: 'Priorité non trouvée.' });
            }

            // Vérifier si la priorité est liée à une réclamation
            const linkedComplaint = await prisma.complaint.findFirst({
                where: { priorityId: parseInt(id) },
            });

            if (linkedComplaint) {
                return res.status(400).json({
                    error: 'Impossible de supprimer cette priorité car elle est liée à une réclamation.',
                });
            }

            await prisma.priority.delete({
                where: { id: parseInt(id) },
            });

            res.status(204).end();
        } catch (error) {
            res.status(500).json({
                error: "Une erreur s'est produite lors de la suppression de la priorité.",
            });
        }
    },
];
