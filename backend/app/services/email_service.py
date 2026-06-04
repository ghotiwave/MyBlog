import smtplib
from email.mime.text import MIMEText
from app.config import settings


def send_verification_email(to_email: str, token: str):
    """Send verification email. Returns True if sent, False if SMTP not configured."""
    if not settings.SMTP_HOST:
        return False

    verify_url = f"{settings.SITE_URL}/api/auth/verify/{token}"
    body = f"欢迎注册 Hety 的个人主页！\n\n请点击以下链接验证你的邮箱：\n\n{verify_url}\n\n如果你没有注册此账号，请忽略此邮件。"
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = "Hety 个人主页 - 邮箱验证"
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email

    try:
        if settings.SMTP_USE_SSL:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, [to_email], msg.as_string())
        server.quit()
        return True
    except Exception:
        return False
