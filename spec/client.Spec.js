import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Mock the PrismaClient instance
const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Client Model', () => {
  const clientId = 1;
  const clientData = {
    id: clientId,
    phone: '1234567890',
    email: 'client@example.com',
    name: 'Client Name',
    address: '123 Client St',
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a client', async () => {
    spyOn(prisma.client, 'create').and.returnValue(Promise.resolve(clientData));
    
    const result = await prisma.client.create({ data: clientData });
    expect(prisma.client.create).toHaveBeenCalledWith({ data: clientData });
    expect(result).toEqual(clientData);
  });

  it('should retrieve a client by id', async () => {
    spyOn(prisma.client, 'findUnique').and.returnValue(Promise.resolve(clientData));
    
    const result = await prisma.client.findUnique({ where: { id: clientId } });
    expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { id: clientId } });
    expect(result).toEqual(clientData);
  });

  it('should update a client by id', async () => {
    const updatedData = { ...clientData, name: 'Updated Client Name' };
    spyOn(prisma.client, 'update').and.returnValue(Promise.resolve(updatedData));
    
    const result = await prisma.client.update({
      where: { id: clientId },
      data: { name: 'Updated Client Name' },
    });
    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: clientId },
      data: { name: 'Updated Client Name' },
    });
    expect(result).toEqual(updatedData);
  });

  it('should delete a client by id', async () => {
    spyOn(prisma.client, 'delete').and.returnValue(Promise.resolve({}));
    
    await prisma.client.delete({ where: { id: clientId } });
    expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: clientId } });
  });
});
