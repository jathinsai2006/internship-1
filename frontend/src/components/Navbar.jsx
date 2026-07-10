function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
      <h1 className="text-3xl font-bold text-cyan-400">
        🚀 IntelliDocs AI
      </h1>

      <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg transition">
        Login
      </button>
    </nav>
  );
}

export default Navbar;