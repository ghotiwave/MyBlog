import { useState, useEffect } from 'react'
import api from '@/services/api'

interface Profile {
  name: string
  bio: string | null
  avatar_url: string | null
  interests: string | null
  experience: string | null
  github_url: string | null
  twitter_url: string | null
}

export function About() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // Profile is public via admin endpoint, but let's make a quick public read
    api.get('/profile').then((res) => setProfile(res.data)).catch(() => {})
  }, [])

  if (!profile) return <div className="text-center text-gray-400 py-12">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
        )}
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
      </div>

      {profile.bio && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
        </section>
      )}

      {profile.interests && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.split(',').map((i) => (
              <span key={i.trim()} className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-100 text-blue-700">
                {i.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.experience && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.experience}</div>
        </section>
      )}

      <section className="flex gap-3">
        {profile.github_url && (
          <a href={profile.github_url} target="_blank" rel="noopener" className="text-blue-600 hover:underline text-sm">GitHub</a>
        )}
        {profile.twitter_url && (
          <a href={profile.twitter_url} target="_blank" rel="noopener" className="text-blue-600 hover:underline text-sm">Twitter</a>
        )}
      </section>
    </div>
  )
}
