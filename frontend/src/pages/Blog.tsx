import { PostList } from '@/components/blog/PostList'

export function Blog() {
  return (
    <div>
      <h1 className="text-3xl text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>博客</h1>
      <p className="text-stone-400 italic mb-6 text-sm">技术文章与个人分享。</p>
      <PostList postType="blog" />
    </div>
  )
}
