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

// Création d'une catégorie avec validation
export const createCategory = [
    body('name')
        .notEmpty()
        .withMessage('Le nom de la catégorie est obligatoire.')
        .isString()
        .withMessage('Le nom de la catégorie doit être une chaîne de caractères.')
        .matches(/^[^\d]*$/)
        .withMessage('Le nom de la catégorie ne doit pas contenir de chiffres.')
        .isLength({ max: 50 })
        .withMessage('Le nom de la catégorie ne peut pas dépasser 50 caractères.'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { name } = req.body;

            // Vérification si le nom existe déjà
            const existingCategory = await prisma.category.findUnique({
                where: { name },
            });

            if (existingCategory) {
                return res
                    .status(409)
                    .json({ error: 'Une catégorie avec ce nom existe déjà.' });
            }

            const category = await prisma.category.create({
                data: { name },
            });
            res.status(201).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Une erreur s'est produite lors de la création de la catégorie.",
            });
        }
    },
];

// Récupérer toutes les catégories
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des catégories.",
        });
    }
};

// Récupérer une catégorie par ID avec validation
export const getCategoryById = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const category = await prisma.category.findUnique({
                where: { id: parseInt(id) },
            });

            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'Catégorie non trouvée.' });
            }
        } catch (error) {
            res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération de la catégorie.",
            });
        }
    },
];

// Mise à jour d'une catégorie avec validation
export const updateCategory = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    body('name')
        .notEmpty()
        .withMessage('Le champ "name" ne doit pas être vide.')
        .isString()
        .withMessage('Le nom de la catégorie doit être une chaîne de caractères.')
        .matches(/^[^\d]*$/)
        .withMessage('Le nom de la catégorie ne doit pas contenir de chiffres.')
        .isLength({ max: 50 })
        .withMessage('Le nom de la catégorie ne peut pas dépasser 50 caractères.'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const existingCategory = await prisma.category.findUnique({
                where: { id: parseInt(id) },
            });

            if (!existingCategory) {
                return res.status(404).json({ error: 'Catégorie non trouvée.' });
            }

            const updatedCategory = await prisma.category.update({
                where: { id: parseInt(id) },
                data: { name },
            });

            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({
                error: "Une erreur s'est produite lors de la mise à jour de la catégorie.",
            });
        }
    },
];

// Suppression d'une catégorie avec validation
export const deleteCategory = [
    // Validation de l'ID dans les paramètres de la requête
    param('id')
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    handleValidationErrors, // Middleware pour gérer les erreurs de validation
    async (req, res) => {
        try {
            const { id } = req.params;

            // Vérifier si la catégorie existe
            const existingCategory = await prisma.category.findUnique({
                where: { id: parseInt(id) },
            });

            if (!existingCategory) {
                return res.status(404).json({ error: 'Catégorie non trouvée.' });
            }

            // Vérifier si la catégorie est liée à une réclamation
            const linkedComplaint = await prisma.complaint.findFirst({
                where: { categoryId: parseInt(id) },
            });

            if (linkedComplaint) {
                return res.status(400).json({
                    error: 'Impossible de supprimer cette catégorie car elle est liée à une réclamation.',
                });
            }

            // Supprimer la catégorie si elle n'est pas liée à une réclamation
            await prisma.category.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie :', error);
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la suppression de la catégorie.",
            });
        }
    },
];

//             await prisma.category.delete({
//                 where: { id: parseInt(id) },
//             });

//             res.status(204).end();
//         } catch (error) {
//             res.status(500).json({
//                 error: "Une erreur s'est produite lors de la suppression de la catégorie.",
//             });
//         }
//     },
// ];
