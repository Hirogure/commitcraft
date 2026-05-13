export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-green-400 mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found.</p>
      <a href="/" className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-gray-950 font-bold text-sm transition-colors">
        Go home
      </a>
    </div>
  );
}
