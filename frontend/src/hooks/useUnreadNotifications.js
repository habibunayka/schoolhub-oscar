import { useCallback, useEffect, useState } from "react";
import api from "../services/client.js";

const EVENT = "notifications:update";

export function triggerNotificationsUpdate() {
  window.dispatchEvent(new Event(EVENT));
}

export default function useUnreadNotifications() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const res = await api.get("/notifications", {
        params: { status: "unread", limit: 1 },
      });
      setCount(res.data.pagination.total);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const handler = () => fetchCount();
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [fetchCount]);

  return count;
}
