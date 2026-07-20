-- CreateEnum
CREATE TYPE "AmbulanceStatus" AS ENUM ('AVAILABLE', 'ON_CALL', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "AmbulanceRequestStatus" AS ENUM ('REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Ambulance" (
    "id" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT,
    "status" "AmbulanceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ambulance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbulanceRequest" (
    "id" TEXT NOT NULL,
    "ambulanceId" TEXT,
    "patientId" TEXT,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "AmbulanceRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AmbulanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ambulance_vehicleNumber_key" ON "Ambulance"("vehicleNumber");

-- CreateIndex
CREATE INDEX "AmbulanceRequest_ambulanceId_idx" ON "AmbulanceRequest"("ambulanceId");

-- CreateIndex
CREATE INDEX "AmbulanceRequest_patientId_idx" ON "AmbulanceRequest"("patientId");

-- AddForeignKey
ALTER TABLE "AmbulanceRequest" ADD CONSTRAINT "AmbulanceRequest_ambulanceId_fkey" FOREIGN KEY ("ambulanceId") REFERENCES "Ambulance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceRequest" ADD CONSTRAINT "AmbulanceRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
