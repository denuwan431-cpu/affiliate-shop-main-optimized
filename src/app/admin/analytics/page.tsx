import { db } from "@/db";
import { clickLogs, products } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { BarChart3, MousePointer2 } from "lucide-react";

export default async function Analytics() {
  const stats = await db.select({ count: sql<number>`count(*)` }).from(clickLogs);
  const topItems = await db.select({ name: products.name, clicks: sql<number>`count(${clickLogs.id})` })
    .from(clickLogs).leftJoin(products, eq(clickLogs.productId, products.id))
    .groupBy(products.name).orderBy(desc(sql`count(${clickLogs.id})`)).limit(10);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black mb-8 flex items-center gap-2"><BarChart3 /> Shop Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-blue-100">
          <MousePointer2 className="text-blue-600 mb-2" />
          <div className="text-4xl font-black text-blue-900">{stats[0].count}</div>
          <div className="text-gray-500 text-sm font-bold">Total Affiliate Clicks</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b font-bold">Top Clicked Products</div>
        <div className="divide-y">
          {topItems.map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium truncate max-w-md">{item.name}</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">{item.clicks} CLICKS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
