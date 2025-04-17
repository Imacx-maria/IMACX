import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="absolute left-8 top-8">
          <div className="flex items-center gap-2">
            <Image
              src="/Logo_dark_theme.png"
              alt="IMACX Suite Logo"
              width={120}
              height={40}
              className="hidden dark:block"
            />
            <Image
              src="/Logo_light_theme.png"
              alt="IMACX Suite Logo"
              width={120}
              height={40}
              className="block dark:hidden"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}