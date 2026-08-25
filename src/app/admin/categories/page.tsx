import { db } from "@/db";
import { categories } from "@/db/schema";
import { upsertCategory, deleteCategory } from "../actions";
import { Trash2, Plus } from "lucide-react";

export default async function AdminCategories() {
  const allCats = await db.query.categories.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y">
          {allCats.map((cat) => (
            <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <div className="font-bold text-gray-800">{cat.name}</div>
                <div className="text-xs text-gray-400">Slug: {cat.slug}</div>
              </div>
              <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                <button className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <h2 className="font-bold mb-4">Add New Category</h2>
        <form action={upsertCategory} className="flex flex-col gap-4">
          <input name="name" placeholder="Category Name (e.g. Electronics)" className="p-3 border rounded-xl" required />
          <input name="slug" placeholder="Slug (e.g. electronics)" className="p-3 border rounded-xl" required />
          <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">Add Category</button>
        </form>
      </div>
    </div>
  );
}
