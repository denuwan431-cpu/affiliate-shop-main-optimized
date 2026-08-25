"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function NewProduct() {
  const router = useRouter();

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Add New Product</h1>
      <form className="bg-white p-10 rounded-[2.5rem] border shadow-sm grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Product Name</label>
          <input required className="w-full p-4 bg-slate-50 border rounded-2xl" placeholder="iPhone 15 Pro" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-red-500 block mb-2">Original Price (Strike)</label>
          <input type="number" className="w-full p-4 bg-slate-50 border rounded-2xl" placeholder="7500" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-green-600 block mb-2">Selling Price</label>
          <input required type="number" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="6000" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Discount Label</label>
          <input className="w-full p-4 bg-slate-50 border rounded-2xl" placeholder="20% OFF" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Category</label>
          <select className="w-full p-4 bg-slate-50 border rounded-2xl cursor-pointer">
             <option>Select Category</option>
             {/* Map Categories */}
          </select>
        </div>

        <div className="col-span-2 flex gap-4 pt-5">
          <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-orange-500 transition-all uppercase">Add Product Now</button>
          <button type="button" onClick={() => router.push("/admin/products")} className="px-10 bg-slate-100 text-slate-500 font-bold py-5 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all uppercase">Cancel</button>
        </div>
      </form>
    </div>
  );
}
