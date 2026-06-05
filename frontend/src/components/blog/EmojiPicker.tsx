import { useState, useEffect, useRef } from 'react'

interface ACEmote { name: string; file: string }

const NATIVE_EMOJI = [
  '😀','😂','🤣','😊','😍','🤩','😎','🥳','😭','😤',
  '👍','👎','👏','🙌','💪','🤝','🎉','🔥','💯','✅',
  '❤️','💔','🫶','🤍','💢','💤','💡','📌','🚀','⭐',
  '🐱','🐶','🐵','🐮','🐸','🦊','🐻','🐼','🐨','🐰',
  '🍉','🍔','🍕','🍣','🎂','☕','🍺','🌈','🎵','💻',
]

interface Props {
  onSelect: (text: string) => void
}

export function EmojiPicker({ onSelect }: Props) {
  const [tab, setTab] = useState<'emoji' | 'acniang'>('emoji')
  const [emotes, setEmotes] = useState<ACEmote[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (tab === 'acniang' && emotes.length === 0) {
      fetch('/emotes/acniang/manifest.json')
        .then((r) => r.json())
        .then(setEmotes)
        .catch(() => setEmotes([]))
    }
  }, [tab, emotes.length])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-2 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer transition-colors"
        title="表情"
      >
        😊
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-lg p-3 w-80">
          <div className="flex gap-1 mb-3 border-b border-[var(--color-border)] pb-2">
            <button
              type="button"
              onClick={() => setTab('emoji')}
              className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors ${tab === 'emoji' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              Emoji
            </button>
            <button
              type="button"
              onClick={() => setTab('acniang')}
              className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors ${tab === 'acniang' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              AC娘
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {tab === 'emoji' && (
              <div className="grid grid-cols-10 gap-1">
                {NATIVE_EMOJI.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onSelect(emoji); setOpen(false) }}
                    className="text-lg hover:bg-[var(--color-surface)] rounded p-0.5 cursor-pointer transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {tab === 'acniang' && emotes.length === 0 && (
              <div className="text-xs text-[var(--color-text-muted)] text-center py-8">
                未找到 AC娘表情包<br />
                <span className="text-[10px]">请将表情放入 public/emotes/acniang/</span>
              </div>
            )}

            {tab === 'acniang' && emotes.length > 0 && (
              <div className="grid grid-cols-8 gap-1.5">
                {emotes.map((emote, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onSelect(`![${emote.name}](/emotes/acniang/${emote.file})`); setOpen(false) }}
                    className="hover:bg-[var(--color-surface)] rounded p-1 cursor-pointer transition-colors flex items-center justify-center"
                    title={emote.name}
                  >
                    <img
                      src={`/emotes/acniang/${emote.file}`}
                      alt={emote.name}
                      className="w-7 h-7 object-contain"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
