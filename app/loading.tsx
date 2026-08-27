export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-blue-600 rounded-full animate-spin"></div>
        <h1 className="font-black text-xl uppercase tracking-widest text-center">
          TUNGGU SEBENTAR...
        </h1>
      </div>
    </div>
  );
}