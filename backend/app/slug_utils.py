import re
import hashlib


def to_slug(text: str, max_len: int = 80) -> str:
    """Convert text to a URL-friendly slug."""
    # Extract ASCII words
    ascii_words = re.findall(r'[a-zA-Z0-9]+', text)
    if ascii_words:
        slug = '-'.join(w.lower() for w in ascii_words)
        return slug[:max_len]

    # Pure Chinese/Unicode title: use a short hash
    h = hashlib.md5(text.encode()).hexdigest()[:6]
    return f'p{h}'
