import { PostList } from '@/components/blog/PostList'

export function Notes() {
  return (
    <div>
      <h1 className="text-3xl text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>笔记</h1>
      <p className="text-stone-400 italic mb-6 text-sm">随想、灵感与学习记录。</p>
      <PostList postType="note" />
    </div>
  )
}
