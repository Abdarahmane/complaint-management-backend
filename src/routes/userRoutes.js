import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'; 

import { authenticateUser } from '../middlewares/authentication.js';

const router = express.Router();

// Création d'utilisateur (sans authentification)
router.post('/', createUser);

// Récupération de tous les utilisateurs (avec authentification)
router.get('/', authenticateUser, getUsers);

// Récupération d'un utilisateur par ID (avec authentification)
router.get('/:id', authenticateUser, getUserById);

// Mise à jour d'un utilisateur par ID (avec authentification)
router.put('/:id', authenticateUser,  updateUser);

// Suppression d'un utilisateur par ID (avec authentification)
router.delete('/:id', authenticateUser, deleteUser);

export default router;
