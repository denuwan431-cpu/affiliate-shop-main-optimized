import { db } from "@/db";
import { banners } from "@/db/schema";
import { upsertBanner, deleteBanner } from "../actions";
import { Trash2, Image as ImageIcon } from "lucide-react";

export default async function AdminBanners() {
  const allBanners = await db.query.banners.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hero Banner Manager</h1>
      
      <div className="grid gap-4 mb-10">
        {allBanners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 border rounded-2xl flex gap-4 items-center">
            <img src={banner.imageUrl} className="w-32 h-20 object-cover rounded-lg bg-gray-100" />
            <div className="flex-1">
              <div className="font-bold">{banner.title}</div>
              <div className="text-sm text-gray-500">{banner.subtitle}</div>
            </div>
            <form action={async () => { "use server"; await deleteBanner(banner.id); }}>
              <button className="text-red-500 p-2"><Trash2 size={20} /></button>
            </form>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
        <h2 className="font-bold mb-4">Add New Banner</h2>
        <form action={upsertBanner} className="grid gap-4">
          <input name="title" placeholder="Banner Title" className="p-3 border rounded-xl" required />
          <input name="subtitle" placeholder="Subtitle" className="p-3 border rounded-xl" />
          <input name="imageUrl" placeholder="Banner Image URL" className="p-3 border rounded-xl" required />
          <input name="buttonUrl" placeholder="Button Link URL" className="p-3 border rounded-xl" defaultValue="/" />
          <button type="submit" className="bg-black text-white font-bold py-3 rounded-xl">Save Banner</button>
        </form>
      </div>
    </div>
  );
}
