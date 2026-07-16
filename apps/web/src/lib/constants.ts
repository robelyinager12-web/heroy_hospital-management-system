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
  { label: "Overview", href: "/overview", icon: LayoutDashboard, roles: ["*"] },
  { label: "Patients", href: "/patients", icon: Users, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "Doctors", href: "/doctors", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Nurses", href: "/nurses", icon: HeartPulse, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Appointments", href: "/appointments", icon: CalendarClock, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"] },
  { label: "Emergency", href: "/emergency", icon: Siren, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "OPD", href: "/opd", icon: Stethoscope, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
  { label: "IPD", href: "/ipd", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Beds", href: "/beds", icon: BedDouble, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"] },
  { label: "Pharmacy", href: "/pharmacy", icon: Pill, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "DOCTOR"] },
  { label: "Laboratory", href: "/laboratory", icon: FlaskConical, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Radiology", href: "/radiology", icon: Scan, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"] },
  { label: "Surgery", href: "/surgery", icon: Scissors, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"] },
  { label: "Billing", href: "/billing", icon: Receipt, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"] },
  { label: "Accounting", href: "/accounting", icon: Wallet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Payroll", href: "/payroll", icon: Banknote, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "ACCOUNTANT"] },
  { label: "Inventory", href: "/inventory", icon: Package, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"] },
  { label: "Ambulance", href: "/ambulance", icon: Truck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"] },
  { label: "Blood Bank", href: "/blood-bank", icon: Droplet, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"] },
  { label: "Insurance", href: "/insurance", icon: ShieldCheck, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER", "ACCOUNTANT"] },
  { label: "Reports", href: "/reports", icon: BarChart3, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"] },
  { label: "Notifications", href: "/notifications", icon: Bell, roles: ["*"] },
  { label: "Chat", href: "/chat", icon: MessageSquare, roles: ["*"] },
  { label: "Video Consultation", href: "/video-consultation", icon: Video, roles: ["DOCTOR", "PATIENT"] },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot, roles: ["*"] },
  { label: "Voice Assistant", href: "/voice-assistant", icon: Mic, roles: ["*"] },
  { label: "Recruitment", href: "/recruitment", icon: Briefcase, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"] },
  { label: "Hospitals", href: "/hospitals", icon: Building2, roles: ["SUPER_ADMIN"] },
  { label: "Audit Logs", href: "/audit-logs", icon: ScrollText, roles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"] },
  { label: "Backup", href: "/backup", icon: DatabaseBackup, roles: ["SUPER_ADMIN"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["*"] },
];

export function getNavForRole(role: string): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes("*") || item.roles.includes(role));
}