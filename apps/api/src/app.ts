import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalRateLimiter } from "./middlewares/rate-limit.middleware";
import { errorHandler } from "./middlewares/error-handler.middleware";
import authRoutes from "./modules/auth/auth.routes";
import patientsRoutes from "./modules/patients/patients.routes";
import doctorsRoutes from "./modules/doctors/doctors.routes";
import nursesRoutes from "./modules/nurses/nurses.routes";
import appointmentsRoutes from "./modules/appointments/appointments.routes";
import emergencyRoutes from "./modules/emergency/emergency.routes";
import billingRoutes from "./modules/billing/billing.routes";
import pharmacyRoutes from "./modules/pharmacy/pharmacy.routes";
import laboratoryRoutes from "./modules/laboratory/laboratory.routes";
import aiRoutes from "./modules/ai/ai.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import radiologyRoutes from "./modules/radiology/radiology.routes";
import surgeryRoutes from "./modules/surgery/surgery.routes";
import ipdRoutes from "./modules/ipd/ipd.routes";
import ambulanceRoutes from "./modules/ambulance/ambulance.routes";
import bloodBankRoutes from "./modules/blood-bank/blood-bank.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: [process.env.CLIENT_URL ?? "http://localhost:3000", "http://192.168.43.171:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/nurses", nursesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/laboratory", laboratoryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/radiology", radiologyRoutes);
app.use("/api/surgery", surgeryRoutes);
app.use("/api/ipd", ipdRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/blood-bank", bloodBankRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;
