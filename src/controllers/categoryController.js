import pkg from '@prisma/client';
import { body, validationResult } from 'express-validator';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createCategory = [
    body('name').notEmpty().withMessage('Category name is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const category = await prisma.category.create({
                data: req.body
            });
            res.status(201).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while creating the category." });
        }
    }
];

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        });
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
