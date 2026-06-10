import { siteConfig } from '@/config'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]/50 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 text-center text-xs text-[var(--color-text-muted)]">
        <p>&copy; {new Date().getFullYear()} {siteConfig.shortName}</p>
        <p className="mt-1">
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">
            宁ICP备2026001939号
          </a>
        </p>
      </div>
    </footer>
  )
}
