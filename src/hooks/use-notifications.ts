"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/ui-store";
import { NotificationItem } from "@/types";

export function useNotifications(role: string): { loading: boolean } {
  const [loading, setLoading] = useState(true);
  const setNotifications = useUIStore((state) => state.setNotifications);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const response = await fetch(`/api/notifications?role=${role}`);
        if (!response.ok) throw new Error("Failed notifications request");
        const data = (await response.json()) as { items: NotificationItem[] };
        if (active) setNotifications(data.items);
      } catch {
        if (active) setNotifications([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void poll();
    const id = window.setInterval(() => {
      void poll();
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [role, setNotifications]);

  return { loading };
}
