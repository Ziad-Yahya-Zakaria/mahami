export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg viewBox="0 0 100 100" width="120" height="120" className="mx-auto">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#logo-gradient)"/>
            <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">مهامي</h1>
        <p className="text-lg text-gray-300 mb-8">تطبيق إدارة المهام الذكي</p>
        
        <a 
          href="/mahamey/index.html"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>افتح التطبيق</span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        
        <div className="mt-12 text-sm text-gray-400">
          <p>من تطوير فريق ZIADPWA</p>
          <p className="mt-1">المطور: زياد يحيى زكريا</p>
        </div>
      </div>
    </main>
  )
}
