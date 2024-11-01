import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'; // Ensure this path is correct
import {
  createUserValidator,
  getUserByIdValidator,
  updateUserValidator,
  deleteUserValidator
} from '../validators/userValidator.js'; // Ensure this path is correct

const router = express.Router();

// Route to create a user
router.post('/', createUserValidator, createUser); // Validate and create a user

// Route to get all users
router.get('/', getUsers); // Use the getUsers function to retrieve all users

// Route to get a user by ID
router.get('/:id', getUserByIdValidator, getUserById); // Validate and get a user by ID

// Route to update a user by ID
router.put('/:id', updateUserValidator, updateUser); // Validate and update a user by ID

// Route to delete a user by ID
router.delete('/:id', deleteUserValidator, deleteUser); // Validate and delete a user by ID

export default router;
