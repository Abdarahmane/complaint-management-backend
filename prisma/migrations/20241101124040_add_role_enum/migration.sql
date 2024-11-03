-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'employer');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "address" VARCHAR(100) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priority" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "soumission_date" TIMESTAMP(3) NOT NULL,
    "statut" VARCHAR(100) NOT NULL,
    "resolved_date" TIMESTAMP(3),
    "userId" INTEGER,
    "clientId" INTEGER NOT NULL,
    "priorityId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Priority_name_key" ON "Priority"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Complaint_clientId_idx" ON "Complaint"("clientId");

-- CreateIndex
CREATE INDEX "Complaint_priorityId_idx" ON "Complaint"("priorityId");

-- CreateIndex
CREATE INDEX "Complaint_categoryId_idx" ON "Complaint"("categoryId");

-- CreateIndex
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
