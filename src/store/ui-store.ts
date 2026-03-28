"use client";

import { create } from "zustand";
import { NotificationItem } from "@/types";

interface UIStore {
  sidebarCollapsed: boolean;
  notifications: NotificationItem[];
  toggleSidebar: () => void;
  setNotifications: (items: NotificationItem[]) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  notifications: [],
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setNotifications: (items) => set({ notifications: items }),
}));
