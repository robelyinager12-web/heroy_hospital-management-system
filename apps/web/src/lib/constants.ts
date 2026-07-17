import {
  LayoutDashboard, Users, Stethoscope, HeartPulse, CalendarClock, Siren,
  BedDouble, Pill, FlaskConical, Scan, Scissors, Receipt, Wallet, Banknote,
  Package, Truck, Droplet, ShieldCheck, BarChart3, Bell, MessageSquare,
  Video, Bot, Mic, Settings, ScrollText, DatabaseBackup, Building2,
  Briefcase, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: string[]; // which roles can see this item
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard/dashboard/overview", icon: LayoutDashboard, roles: ["*"] },
  { label: "Patients", href: "/dashboard/dashboard/patients", icon: Users, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "Doctors", href: "/dashboard/dashboard/doctors", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Nurses", href: "/dashboard/dashboard/nurses", icon: HeartPulse, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Appointments", href: "/dashboard/dashboard/appointments", icon: CalendarClock, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"] },
  { label: "Emergency", href: "/dashboard/dashboard/emergency", icon: Siren, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "OPD", href: "/dashboard/dashboard/opd", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "IPD", href: "/dashboard/dashboard/ipd", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Beds", href: "/dashboard/dashboard/beds", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"] },
  { label: "Pharmacy", href: "/dashboard/dashboard/pharmacy", icon: Pill, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "DOCTOR"] },
  { label: "Laboratory", href: "/dashboard/dashboard/laboratory", icon: FlaskConical, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Radiology", href: "/dashboard/dashboard/radiology", icon: Scan, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Surgery", href: "/dashboard/dashboard/surgery", icon: Scissors, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Billing", href: "/dashboard/dashboard/billing", icon: Receipt, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"] },
  { label: "Accounting", href: "/dashboard/dashboard/accounting", icon: Wallet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Payroll", href: "/dashboard/dashboard/payroll", icon: Banknote, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "ACCOUNTANT"] },
  { label: "Inventory", href: "/dashboard/dashboard/inventory", icon: Package, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"] },
  { label: "Ambulance", href: "/dashboard/dashboard/ambulance", icon: Truck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"] },
  { label: "Blood Bank", href: "/dashboard/dashboard/blood-bank", icon: Droplet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"] },
  { label: "Insurance", href: "/dashboard/dashboard/insurance", icon: ShieldCheck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER", "ACCOUNTANT"] },
  { label: "Reports", href: "/dashboard/dashboard/reports", icon: BarChart3, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Notifications", href: "/dashboard/dashboard/notifications", icon: Bell, roles: ["*"] },
  { label: "Chat", href: "/dashboard/dashboard/chat", icon: MessageSquare, roles: ["*"] },
  { label: "Video Consultation", href: "/dashboard/dashboard/video-consultation", icon: Video, roles: ["DOCTOR", "PATIENT"] },
  { label: "AI Assistant", href: "/dashboard/dashboard/ai-assistant", icon: Bot, roles: ["*"] },
  { label: "Voice Assistant", href: "/dashboard/dashboard/voice-assistant", icon: Mic, roles: ["*"] },
  { label: "Recruitment", href: "/dashboard/dashboard/recruitment", icon: Briefcase, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Hospitals", href: "/dashboard/dashboard/hospitals", icon: Building2, roles: ["SUPER_ADMIN"] },
  { label: "Audit Logs", href: "/dashboard/dashboard/audit-logs", icon: ScrollText, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"] },
  { label: "Backup", href: "/dashboard/dashboard/backup", icon: DatabaseBackup, roles: ["SUPER_ADMIN"] },
  { label: "Settings", href: "/dashboard/dashboard/settings", icon: Settings, roles: ["*"] },
];

export function getNavForRole(role: string): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes("*") || item.roles.includes(role));
}