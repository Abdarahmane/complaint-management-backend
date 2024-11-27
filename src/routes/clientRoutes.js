import express from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clientController.js';
const router = express.Router();

router.post('/', createClient); // Créer un client
router.get('/', getClients); // Récupérer tous les clients
router.get('/:id', getClientById); // Récupérer un client par ID
router.put('/:id', updateClient); // Mettre à jour un client par ID
router.delete('/:id', deleteClient); // Supprimer un client par ID

export default router;
