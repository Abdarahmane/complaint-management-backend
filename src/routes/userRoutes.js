import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'; // Assure-toi que ce chemin est correct
import {
  createUserValidator,
  getUserByIdValidator,
  updateUserValidator,
  deleteUserValidator
} from '../validators/userValidator.js'; // Assure-toi que ce chemin est correct
import { authenticateUser } from '../middlewares/authentication.js'; // Importer le middleware d'authentification

const router = express.Router();

// Route pour créer un utilisateur (pas besoin d'authentification pour l'inscription)
router.post('/', createUserValidator, createUser);

// Route pour récupérer tous les utilisateurs (nécessite authentification)
router.get('/', authenticateUser, getUsers);

// Route pour récupérer un utilisateur par ID (nécessite authentification)
router.get('/:id', authenticateUser, getUserByIdValidator, getUserById);

// Route pour mettre à jour un utilisateur par ID (nécessite authentification)
router.put('/:id', authenticateUser, updateUserValidator, updateUser);

// Route pour supprimer un utilisateur par ID (nécessite authentification)
router.delete('/:id', authenticateUser, deleteUserValidator, deleteUser);

export default router;
