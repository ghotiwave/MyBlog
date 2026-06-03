export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Hety的个人主页. 由 React + FastAPI 驱动.
      </div>
    </footer>
  )
}
