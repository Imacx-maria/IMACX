import {
  HomeIcon,
  LineChartIcon, // Using LineChartIcon for Analytics
  PackageIcon, // Stock Management
  FileTextIcon, // Quoting System
  FactoryIcon, // Production Management
  UserCircleIcon, // Employee Portal
  DollarSignIcon, // Price Structure
  UsersIcon, // User Management
  SettingsIcon, // Settings
  PuzzleIcon, // Components
  Palette,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string; // Added for dashboard cards
}

export const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: HomeIcon,
    description: "Visão geral e acesso rápido",
  },
  {
    title: "Análises",
    href: "/analytics",
    icon: LineChartIcon,
    description: "Visualizar análises e relatórios detalhados",
  },
  {
    title: "Stocks",
    href: "/stock-management",
    icon: PackageIcon,
    description: "Gerir inventário e níveis de stock",
  },
  {
    title: "Orçamentos",
    href: "/quoting-system",
    icon: FileTextIcon,
    description: "Criar e gerir orçamentos de clientes",
  },
  {
    title: "Produção",
    href: "/production-management",
    icon: FactoryIcon,
    description: "Acompanhar processos de produção",
  },
  {
    title: "Colaboradores",
    href: "/employees",
    icon: UserCircleIcon,
    description: "Aceder a informações dos colaboradores",
  },
  {
    title: "Cálculo Preços",
    href: "/price-structure",
    icon: DollarSignIcon,
    description: "Definir e gerir modelos de preços",
  },
  {
    title: "Gestão Utilizadores",
    href: "/users",
    icon: UsersIcon,
    description: "Gerir contas e permissões de utilizadores",
  },
  {
    title: "Definições",
    href: "/settings",
    icon: SettingsIcon,
    description: "Configurar definições e preferências do sistema",
  },
  {
    title: "Componentes",
    href: "/components",
    icon: PuzzleIcon,
    description: "Visualizar componentes da interface",
  },
  {
    title: "Style Guide",
    href: "/style-guide",
    icon: Palette,
    description: "Visualizar cores, tipografia e componentes",
  },
];