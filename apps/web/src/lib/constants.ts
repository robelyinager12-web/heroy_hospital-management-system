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
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard, roles: ["*"] },
  { label: "Patients", href: "/dashboard/patients", icon: Users, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "Doctors", href: "/dashboard/doctors", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Nurses", href: "/dashboard/nurses", icon: HeartPulse, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Appointments", href: "/dashboard/appointments", icon: CalendarClock, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"] },
  { label: "Emergency", href: "/dashboard/emergency", icon: Siren, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "OPD", href: "/dashboard/opd", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "IPD", href: "/dashboard/ipd", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Beds", href: "/dashboard/beds", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"] },
  { label: "Pharmacy", href: "/dashboard/pharmacy", icon: Pill, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "DOCTOR"] },
  { label: "Laboratory", href: "/dashboard/laboratory", icon: FlaskConical, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Radiology", href: "/dashboard/radiology", icon: Scan, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Surgery", href: "/dashboard/surgery", icon: Scissors, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Billing", href: "/dashboard/billing", icon: Receipt, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"] },
  { label: "Accounting", href: "/dashboard/accounting", icon: Wallet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Payroll", href: "/dashboard/payroll", icon: Banknote, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "ACCOUNTANT"] },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"] },
  { label: "Ambulance", href: "/dashboard/ambulance", icon: Truck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"] },
  { label: "Blood Bank", href: "/dashboard/blood-bank", icon: Droplet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"] },
  { label: "Insurance", href: "/dashboard/insurance", icon: ShieldCheck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER", "ACCOUNTANT"] },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["*"] },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare, roles: ["*"] },
  { label: "Video Consultation", href: "/dashboard/video-consultation", icon: Video, roles: ["DOCTOR", "PATIENT"] },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot, roles: ["*"] },
  { label: "Voice Assistant", href: "/dashboard/voice-assistant", icon: Mic, roles: ["*"] },
  { label: "Recruitment", href: "/dashboard/recruitment", icon: Briefcase, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Hospitals", href: "/dashboard/hospitals", icon: Building2, roles: ["SUPER_ADMIN"] },
  { label: "Audit Logs", href: "/dashboard/audit-logs", icon: ScrollText, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"] },
  { label: "Backup", href: "/dashboard/backup", icon: DatabaseBackup, roles: ["SUPER_ADMIN"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["*"] },
];

export function getNavForRole(role: string): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes("*") || item.roles.includes(role));
}