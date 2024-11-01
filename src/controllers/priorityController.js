import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const createPriority = async (req, res) => {
    try {
        const priority = await prisma.priority.create({
            data: req.body
        });
        res.status(201).json(priority);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPriorities = async (req, res) => {
    try {
        const priorities = await prisma.priority.findMany();
        res.status(200).json(priorities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPriorityById = async (req, res) => {
    try {
        const { id } = req.params;
        const priority = await prisma.priority.findUnique({
            where: { id: parseInt(id) }
        });
        if (priority) {
            res.status(200).json(priority);
        } else {
            res.status(404).json({ error: "Priority not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePriority = async (req, res) => {
    try {
        const { id } = req.params;
        const priority = await prisma.priority.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(priority);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePriority = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.priority.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
