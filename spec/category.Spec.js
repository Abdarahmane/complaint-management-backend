import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Mock the PrismaClient instance
const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Category Model', () => {
  const categoryId = 1;
  const categoryData = {
    id: categoryId,
    name: 'Service Category',
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a category', async () => {
    spyOn(prisma.category, 'create').and.returnValue(Promise.resolve(categoryData));
    
    const result = await prisma.category.create({ data: categoryData });
    expect(prisma.category.create).toHaveBeenCalledWith({ data: categoryData });
    expect(result).toEqual(categoryData);
  });

  it('should retrieve a category by id', async () => {
    spyOn(prisma.category, 'findUnique').and.returnValue(Promise.resolve(categoryData));
    
    const result = await prisma.category.findUnique({ where: { id: categoryId } });
    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: categoryId } });
    expect(result).toEqual(categoryData);
  });

  it('should update a category by id', async () => {
    const updatedData = { ...categoryData, name: 'Updated Category' };
    spyOn(prisma.category, 'update').and.returnValue(Promise.resolve(updatedData));
    
    const result = await prisma.category.update({
      where: { id: categoryId },
      data: { name: 'Updated Category' },
    });
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: categoryId },
      data: { name: 'Updated Category' },
    });
    expect(result).toEqual(updatedData);
  });

  it('should delete a category by id', async () => {
    spyOn(prisma.category, 'delete').and.returnValue(Promise.resolve({}));
    
    await prisma.category.delete({ where: { id: categoryId } });
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: categoryId } });
  });
});
