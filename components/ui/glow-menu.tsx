"use client"

import * as React from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useState } from "react"

interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  gradient: string
  iconColor: string
  subItems?: MenuItem[]
}

interface MenuBarProps {
  items: MenuItem[]
  activeItem: string
  onItemClick: (label: string) => void
}

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

const submenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

export function MenuBar({ items, activeItem, onItemClick }: MenuBarProps) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      setOpenSubmenu(openSubmenu === item.label ? null : item.label)
    } else {
      setOpenSubmenu(null)
      onItemClick(item.label)
    }
  }

  const handleSubItemClick = (subItem: MenuItem) => {
    setOpenSubmenu(null)
    onItemClick(subItem.label)
  }

  return (
    <nav className={cn(
      "flex flex-row items-center gap-2 p-2 rounded-xl backdrop-blur-sm relative z-30",
      "dark:bg-black/20 bg-white/20",
      "font-mono"
    )}>
      {items.map((item) => (
        <div key={item.label} className="relative">
          <motion.button
            className={cn(
              "relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-mono",
              "dark:text-white/90 dark:hover:text-white text-black/90 hover:text-black",
              activeItem === item.label && "dark:text-white text-black"
            )}
            style={{
              background: activeItem === item.label ? item.gradient : "transparent",
              fontFamily: "var(--font-geist-mono)",
            }}
            onClick={() => handleItemClick(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={cn(
                "absolute inset-0 rounded-lg opacity-0",
                "dark:bg-white/10 bg-black/10"
              )}
              style={{ background: item.gradient }}
              initial={false}
              animate={{
                scale: activeItem === item.label ? 2 : 1,
                opacity: activeItem === item.label ? 0.15 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <item.icon className={cn("w-6 h-6 stroke-[1.5]", item.iconColor)} />
            <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-sm font-medium">{item.label}</span>
          </motion.button>
          
          <AnimatePresence>
            {item.subItems && openSubmenu === item.label && (
              <motion.div
                className={cn(
                  "absolute top-full left-0 mt-1 min-w-[240px] backdrop-blur-sm rounded-lg border z-50",
                  "dark:bg-black/90 dark:border-white/10 bg-white/90 border-black/10"
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {item.subItems.map((subItem) => (
                  <motion.button
                    key={subItem.label}
                    className={cn(
                      "relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors w-full font-mono",
                      "dark:text-white/90 dark:hover:text-white text-black/90 hover:text-black",
                      activeItem === subItem.label && "dark:text-white text-black"
                    )}
                    style={{
                      background: activeItem === subItem.label ? subItem.gradient : "transparent",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                    onClick={() => handleSubItemClick(subItem)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-lg opacity-0",
                        "dark:bg-white/10 bg-black/10"
                      )}
                      style={{ background: subItem.gradient }}
                      initial={false}
                      animate={{
                        scale: activeItem === subItem.label ? 2 : 1,
                        opacity: activeItem === subItem.label ? 0.15 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <subItem.icon className={cn("w-5 h-5 stroke-[1.5]", subItem.iconColor)} />
                    <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-sm font-medium">{subItem.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  )
}

MenuBar.displayName = "MenuBar" 