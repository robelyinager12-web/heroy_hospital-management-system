-- CreateEnum
CREATE TYPE "BloodRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'FULFILLED', 'CANCELLED');

-- CreateTable
CREATE TABLE "BloodStock" (
    "id" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "bloodGroup" "BloodGroup" NOT NULL,
    "unitsRequested" INTEGER NOT NULL,
    "status" "BloodRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BloodStock_bloodGroup_key" ON "BloodStock"("bloodGroup");

-- CreateIndex
CREATE INDEX "BloodRequest_patientId_idx" ON "BloodRequest"("patientId");

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
