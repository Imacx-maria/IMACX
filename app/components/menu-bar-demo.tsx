"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutGrid,
  PieChart,
  PackageOpen,
  FileText,
  CalendarCog,
  Users,
  Settings,
  UserCog,
  Puzzle,
  Palette,
  Cog,
  CircleDollarSign,
  Workflow // Added icon for Designer Flow
} from "lucide-react"
import { MenuBar } from "@/components/ui/glow-menu"
import { useAuth } from "@/lib/auth/auth-context"

const menuItems = [
  {
    icon: PieChart,
    label: "Análises",
    href: "/analytics",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: PackageOpen,
    label: "Stocks",
    href: "/stock-management",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: FileText,
    label: "Orçamentos",
    href: "/quoting-system",
    gradient: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.06) 50%, rgba(88,28,135,0) 100%)",
    iconColor: "text-purple-500",
  },
  {
    icon: CalendarCog,
    label: "Produção",
    href: "/production-management",
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500",
  },
  {
    icon: Workflow, // Use the new icon
    label: "Designer Flow",
    href: "/designer-flow", // Path to the new page
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)", // Example blue gradient
    iconColor: "text-blue-500", // Example blue color
  },
  {
    icon: Users,
    label: "Colaboradores",
    href: "/employees",
    gradient: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(2,132,199,0.06) 50%, rgba(3,105,161,0) 100%)",
    iconColor: "text-sky-500",
  },
  {
    icon: Cog,
    label: "Definições",
    href: "#",
    gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
    iconColor: "text-gray-500",
    subItems: [
      {
        icon: UserCog,
        label: "Gestão Utilizadores",
        href: "/users",
        gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
        iconColor: "text-gray-500",
      },
      {
        icon: Settings,
        label: "Definições",
        href: "/settings",
        gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
        iconColor: "text-gray-500",
      },
      {
        icon: CircleDollarSign,
        label: "Cálculo Preços",
        href: "/price-structure",
        gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
        iconColor: "text-gray-500",
      },
      {
        icon: Puzzle,
        label: "Componentes",
        href: "/components",
        gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
        iconColor: "text-gray-500",
      },
      {
        icon: Palette,
        label: "Style Guide",
        href: "/style-guide",
        gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)",
        iconColor: "text-gray-500",
      },
    ],
  },
]

export function MenuBarDemo() {
  const [activeItem, setActiveItem] = useState<string>("Dashboard")
  const router = useRouter()
  const { logout } = useAuth()

  const handleItemClick = async (label: string) => {
    setActiveItem(label)
    
    const item = menuItems.find(item => item.label === label) || 
                menuItems.find(item => item.subItems?.some(sub => sub.label === label))?.subItems?.find(sub => sub.label === label)
    
    if (item?.href && item.href !== "#") {
      router.push(item.href)
    }
  }

  return (
    <MenuBar
      items={menuItems}
      activeItem={activeItem}
      onItemClick={handleItemClick}
    />
  )
} 