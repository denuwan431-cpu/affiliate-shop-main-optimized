import { db } from "@/db";
import { clickLogs, products } from "@/db/schema";
import { sql, desc, eq } from "drizzle-orm";
import { BarChart3, MousePointer2 } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const stats = await db.select({ count: sql<number>`count(*)` }).from(clickLogs);
  
  const topItems = await db.select({ 
    name: products.name, 
    clicks: sql<number>`count(${clickLogs.id})` 
  })
    .from(clickLogs)
    .leftJoin(products, eq(clickLogs.productId, products.id))
    .groupBy(products.name)
    .orderBy(desc(sql`count(${clickLogs.id})`))
    .limit(10);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black mb-8 flex items-center gap-2 text-gray-800">
        <BarChart3 /> Affiliate Performance
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-orange-600 text-white p-8 rounded-3xl shadow-xl flex flex-col gap-1">
          <MousePointer2 size={32} className="opacity-80" />
          <div className="text-4xl font-black">{stats[0].count}</div>
          <div className="text-xs font-bold uppercase tracking-widest">Total Affiliate Clicks</div>
        </div>
      </div>
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-5 bg-gray-50 border-b font-bold text-gray-700">Top Performing Deals</div>
        <div className="divide-y divide-gray-100">
          {topItems.map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="text-sm font-bold text-gray-700 truncate max-w-xs">{item.name || 'Deleted Product'}</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black">{item.clicks} CLICKS</span>
            </div>
          ))}
          {topItems.length === 0 && <div className="p-10 text-center text-gray-400">No data tracked yet.</div>}
        </div>
      </div>
    </div>
  );
}
