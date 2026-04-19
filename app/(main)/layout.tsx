"use client"

import { MobileShell } from "@/components/mobile-shell"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MobileShell>{children}</MobileShell>
}
