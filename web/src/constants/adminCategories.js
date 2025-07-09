// src/constants/adminCategories.js
import { UserCheck, UserX, Users, Crown } from "lucide-react";

export const categories = [
  {
    id: "verified-veterinary",
    name: "Verified Veterinary",
    icon: UserCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "unverified-veterinary",
    name: "Unverified Veterinary",
    icon: UserX,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "verified-clinic",
    name: "Verified Clinic",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "unverified-clinic",
    name: "Unverified Clinic",
    icon: Crown,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];