export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MyBlog. Built with React + FastAPI.
      </div>
    </footer>
  )
}
