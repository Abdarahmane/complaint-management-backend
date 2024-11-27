import express from 'express';
import { createPriority, getPriorities, getPriorityById, updatePriority, deletePriority } from '../controllers/priorityController.js';

const router = express.Router();

router.post('/', createPriority); // Créer une priorité
router.get('/', getPriorities); // Récupérer toutes les priorités
router.get('/:id', getPriorityById); // Récupérer une priorité par ID
router.put('/:id', updatePriority); // Mettre à jour une priorité par ID
router.delete('/:id', deletePriority); // Supprimer une priorité par ID

export default router;
