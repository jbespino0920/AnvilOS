/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: July 23, 2026
*/

"use server";

import { prisma } from "./_shared";
import { phMidnight, phEndOfDay } from "@/lib/format";

function toPHDateString(date: Date): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const ph = new Date(utc + 8 * 3600000);
  const y = ph.getFullYear();
  const m = String(ph.getMonth() + 1).padStart(2, "0");
  const d = String(ph.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getDashboardKpis() {
  const now = new Date();
  const phDateStr = toPHDateString(now);
  const today = phMidnight(phDateStr);
  const tomorrow = phEndOfDay(phDateStr);

  const [
    dailySales,
    lowStockCount,
    totalProducts,
    totalTransactions,
    products,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        transactionDate: { gte: today, lt: tomorrow },
        transactionStatus: "Completed",
        transactionType: { in: ["SaleWalkIn", "SalePO"] },
      },
      _sum: { grandTotal: true },
      _count: true,
    }),
    prisma.product.count({
      where: {
        quantity: { lte: prisma.product.fields.minThreshold },
        isAvailable: true,
      },
    }),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.transaction.count(),
    prisma.product.findMany({
      where: { isAvailable: true },
      select: { unitPrice: true, quantity: true, sellingPrice: true },
    }),
  ]);

  // Cost-basis valuation: only active SKUs, unitPrice (cost) * qty.
  // 805 SKUs have unitPrice=0 and contribute 0 — they are dirty data and excluded from value but counted in totalProducts.
  // If cost is missing we do NOT fallback to sellingPrice to avoid double-inflating retail value (selling 16.8M vs cost 12.08M).
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + Number(p.unitPrice || 0) * Number(p.quantity || 0),
    0,
  );
  const totalInventoryRetailValue = products.reduce(
    (sum, p) => sum + Number((p as any).sellingPrice || 0) * Number(p.quantity || 0),
    0,
  );
  // Diagnostic: log skew when retail >> cost (rope data is inverted: unit >> sell)
  if (totalInventoryRetailValue > totalInventoryValue * 1.5) {
    console.warn(
      `[dashboard] retail value (${totalInventoryRetailValue.toFixed(2)}) >> cost value (${totalInventoryValue.toFixed(2)}): check inverted unitPrice/sellingPrice on rope SKUs`,
    );
  }

  return {
    dailySales: Number(dailySales._sum.grandTotal || 0),
    transactionCount: dailySales._count,
    lowStockCount,
    totalProducts,
    totalTransactions,
    totalInventoryValue,
    totalInventoryRetailValue,
  };
}

export async function getDashboardCharts() {
  const [txnTypes, stockStatuses] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["transactionType"],
      _count: true,
    }),
    prisma.product.findMany({
      where: { isAvailable: true },
      select: { quantity: true, minThreshold: true },
    }),
  ]);

  const inStock = stockStatuses.filter(
    (p) => p.quantity > p.minThreshold,
  ).length;
  const lowStock = stockStatuses.filter(
    (p) => p.quantity <= p.minThreshold && p.quantity > 0,
  ).length;
  const outOfStock = stockStatuses.filter((p) => p.quantity === 0).length;

  return {
    transactionTypes: txnTypes.map((t) => ({
      type: t.transactionType,
      count: t._count,
    })),
    stockStatus: { inStock, lowStock, outOfStock },
  };
}
