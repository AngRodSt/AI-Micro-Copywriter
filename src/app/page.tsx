import CTAEditor from "../components/CTAEditor";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">CopySmith IA</h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Create compelling marketing copy and content with AI assistance.
          Generate multiple variations and optimize your messaging for better
          results.
        </p>
      </header>

      {/* Main Content */}
      <CTAEditor />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>
              &copy; 2025 CopySmith AI. Crafting compelling content with
              artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
