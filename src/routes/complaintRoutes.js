import express from 'express';
import { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint } from '../controllers/complaintController.js';
import { createComplaintValidator, getComplaintByIdValidator, updateComplaintValidator, deleteComplaintValidator } from '../validators/complaintValidator.js';

const router = express.Router();

router.post('/', createComplaint); // Créer une réclamation
router.get('/', getComplaints); // Récupérer toutes les réclamations
router.get('/:id', getComplaintById); // Récupérer une réclamation par ID
router.put('/:id', updateComplaint); // Mettre à jour une réclamation par ID
router.delete('/:id', deleteComplaint); // Supprimer une réclamation par ID

export default router;
