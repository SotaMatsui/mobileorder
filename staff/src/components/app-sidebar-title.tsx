'use client';

import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebarTitle() {
  const { state } = useSidebar();
  return <p className={`px-4 pt-6 pb-3 text-lg font-semibold ${state == 'expanded' ? 'block' : 'hidden'}`}>Mobile Order Staff</p>
}