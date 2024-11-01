import express from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { createComplaintValidator, getComplaintByIdValidator, updateComplaintValidator, deleteComplaintValidator } from '../validators/complaintValidator.js';
const router = express.Router();

router.post('/', createCategory); // Créer une catégorie
router.get('/', getCategories); // Récupérer toutes les catégories
router.get('/:id', getCategoryById); // Récupérer une catégorie par ID
router.put('/:id', updateCategory); // Mettre à jour une catégorie p
router.delete('/:id', deleteCategory); // Supprimer une catégorie par ID

export default router;
