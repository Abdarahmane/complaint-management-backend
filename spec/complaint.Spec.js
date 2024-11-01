import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Mock the PrismaClient instance
const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Complaint Model', () => {
  const complaintId = 1;
  const complaintData = {
    id: complaintId,
    description: 'Complaint Description',
    soumission_date: new Date(),
    statut: 'open',
    clientId: 1,
    priorityId: 1,
    categoryId: 1,
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a complaint', async () => {
    spyOn(prisma.complaint, 'create').and.returnValue(Promise.resolve(complaintData));
    
    const result = await prisma.complaint.create({ data: complaintData });
    expect(prisma.complaint.create).toHaveBeenCalledWith({ data: complaintData });
    expect(result).toEqual(complaintData);
  });

  it('should retrieve a complaint by id', async () => {
    spyOn(prisma.complaint, 'findUnique').and.returnValue(Promise.resolve(complaintData));
    
    const result = await prisma.complaint.findUnique({ where: { id: complaintId } });
    expect(prisma.complaint.findUnique).toHaveBeenCalledWith({ where: { id: complaintId } });
    expect(result).toEqual(complaintData);
  });

  it('should update a complaint by id', async () => {
    const updatedData = { ...complaintData, description: 'Updated Description' };
    spyOn(prisma.complaint, 'update').and.returnValue(Promise.resolve(updatedData));
    
    const result = await prisma.complaint.update({
      where: { id: complaintId },
      data: { description: 'Updated Description' },
    });
    expect(prisma.complaint.update).toHaveBeenCalledWith({
      where: { id: complaintId },
      data: { description: 'Updated Description' },
    });
    expect(result).toEqual(updatedData);
  });

  it('should delete a complaint by id', async () => {
    spyOn(prisma.complaint, 'delete').and.returnValue(Promise.resolve({}));
    
    await prisma.complaint.delete({ where: { id: complaintId } });
    expect(prisma.complaint.delete).toHaveBeenCalledWith({ where: { id: complaintId } });
  });
});
