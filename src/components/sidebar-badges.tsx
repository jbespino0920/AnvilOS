/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: July 11, 2026
*/

"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardKpis, getTransactionsCount } from "@/actions";
import { isStaleActionError, reloadForNewDeployment } from "@/lib/stale-action";

function handleStale(e: unknown) {
  if (isStaleActionError(e)) reloadForNewDeployment();
}

export function useSidebarBadges() {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingRestockCount, setPendingRestockCount] = useState(0);
  const [pendingPOCount, setPendingPOCount] = useState(0);

  const fetch = useCallback(async () => {
    try {
      const kpis = await getDashboardKpis();
      setLowStockCount(kpis.lowStockCount);
    } catch (e) {
      handleStale(e);
    }
    try {
      const count = await getTransactionsCount({
        status: "Ongoing",
        type: "Restock",
      });
      setPendingRestockCount(count);
    } catch (e) {
      handleStale(e);
    }
    try {
      const count = await getTransactionsCount({
        status: "Processing",
        type: "SalePO",
      });
      setPendingPOCount(count);
    } catch (e) {
      handleStale(e);
    }
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 30000);
    const onFocus = () => fetch();
    window.addEventListener("focus", onFocus);
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetch();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetch]);

  return { lowStockCount, pendingRestockCount, pendingPOCount };
}
