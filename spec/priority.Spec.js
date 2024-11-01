import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Mock the PrismaClient instance
const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Priority Model', () => {
  const priorityId = 1;
  const priorityData = {
    id: priorityId,
    name: 'High',
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a priority', async () => {
    spyOn(prisma.priority, 'create').and.returnValue(Promise.resolve(priorityData));
    
    const result = await prisma.priority.create({ data: priorityData });
    expect(prisma.priority.create).toHaveBeenCalledWith({ data: priorityData });
    expect(result).toEqual(priorityData);
  });

  it('should retrieve a priority by id', async () => {
    spyOn(prisma.priority, 'findUnique').and.returnValue(Promise.resolve(priorityData));
    
    const result = await prisma.priority.findUnique({ where: { id: priorityId } });
    expect(prisma.priority.findUnique).toHaveBeenCalledWith({ where: { id: priorityId } });
    expect(result).toEqual(priorityData);
  });

  it('should update a priority by id', async () => {
    const updatedData = { ...priorityData, name: 'Medium' };
    spyOn(prisma.priority, 'update').and.returnValue(Promise.resolve(updatedData));
    
    const result = await prisma.priority.update({
      where: { id: priorityId },
      data: { name: 'Medium' },
    });
    expect(prisma.priority.update).toHaveBeenCalledWith({
      where: { id: priorityId },
      data: { name: 'Medium' },
    });
    expect(result).toEqual(updatedData);
  });

  it('should delete a priority by id', async () => {
    spyOn(prisma.priority, 'delete').and.returnValue(Promise.resolve({}));
    
    await prisma.priority.delete({ where: { id: priorityId } });
    expect(prisma.priority.delete).toHaveBeenCalledWith({ where: { id: priorityId } });
  });
});
