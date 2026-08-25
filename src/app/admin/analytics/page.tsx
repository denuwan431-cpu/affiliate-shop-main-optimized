"use client";
import { toast } from "react-hot-toast";

export default function AdminAnalytics() {
  const handleReset = async () => {
    if(confirm("Are you sure you want to clear all statistics?")) {
      // API call to reset
      toast.success("Analytics Data Cleared!");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black">Analytics</h1>
        <button onClick={handleReset} className="bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">
          RESET ANALYTICS
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Product Clicks</p>
          <h2 className="text-6xl font-black text-slate-900 mt-4">1,452</h2>
        </div>
      </div>
    </div>
  );
}
