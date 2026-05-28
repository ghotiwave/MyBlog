import json
import requests
from datetime import datetime, timezone, timedelta


def fetch_github_trending():
    """Fetch trending repos from GitHub"""
    try:
        # GitHub trending - using the search API for repos created/updated recently
        since = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
        resp = requests.get(
            "https://api.github.com/search/repositories",
            params={
                "q": f"created:>{since}",
                "sort": "stars",
                "order": "desc",
                "per_page": 10,
            },
            headers={"Accept": "application/vnd.github.v3+json"},
            timeout=15,
        )
        if resp.status_code == 200:
            items = resp.json().get("items", [])
            return [
                {
                    "title": item["full_name"],
                    "url": item["html_url"],
                    "description": item.get("description", "No description"),
                    "stars": item.get("stargazers_count", 0),
                    "source": "GitHub Trending",
                }
                for item in items
            ]
        return []
    except Exception:
        return []


def fetch_hackernews_top():
    """Fetch top stories from Hacker News"""
    try:
        resp = requests.get(
            "https://hacker-news.firebaseio.com/v0/topstories.json",
            timeout=15,
        )
        if resp.status_code == 200:
            ids = resp.json()[:10]
            items = []
            for sid in ids:
                detail = requests.get(
                    f"https://hacker-news.firebaseio.com/v0/item/{sid}.json",
                    timeout=10,
                )
                if detail.status_code == 200:
                    d = detail.json()
                    items.append({
                        "title": d.get("title", "Untitled"),
                        "url": d.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                        "description": f"{d.get('score', 0)} points, {d.get('descendants', 0)} comments",
                        "source": "Hacker News",
                    })
            return items
        return []
    except Exception:
        return []


def fetch_all_news():
    """Aggregate news from all sources"""
    news = []
    news.extend(fetch_github_trending())
    news.extend(fetch_hackernews_top())
    return news
