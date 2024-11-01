import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Créer une réclamation
export const createComplaint = async (req, res) => {
    try {
        const complaint = await prisma.complaint.create({
            data: req.body
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer toutes les réclamations
export const getComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une réclamation par ID
export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await prisma.complaint.findUnique({
            where: { id: parseInt(id) }
        });
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({ error: "Complaint not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une réclamation
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une réclamation
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.complaint.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
