export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">مهامي</h1>
        <p className="text-lg text-gray-300 mb-8">تطبيق إدارة المهام الذكي</p>

        <a
          href="/mahamey/index.html"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>افتح التطبيق</span>
        </a>

        <div className="mt-12 text-sm text-gray-400">
          <p>من تطوير فريق ZIADPWA</p>
          <p className="mt-1">المطور: زياد يحيى زكريا</p>
        </div>
      </div>
    </main>
  )
}
