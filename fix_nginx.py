import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("106.54.211.108", username="ubuntu", password="Zcnhcgd18", timeout=15)
print("Connected\n")

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(out)
    if err: print(err)
    return out

# Upload fixed nginx.conf
print("=== Uploading nginx.conf ===")
sftp = ssh.open_sftp()
sftp.put("D:/MySite/blog/frontend/nginx.conf", "/home/ubuntu/blog/frontend/nginx.conf")
sftp.close()
print("Done")

# Rebuild frontend
print("\n=== Rebuilding frontend ===")
run("cd ~/blog && docker compose up -d --build frontend 2>&1")

# Test notes pages
print("\n=== Testing ===")
run("curl -s -o /dev/null -w '/notes/ : HTTP %{http_code}' http://localhost:80/notes/")
print()
run("curl -s -o /dev/null -w '/notes/first-note.html : HTTP %{http_code}' http://localhost:80/notes/first-note.html")
print()
run("curl -s -o /dev/null -w '/notes/second-note.html : HTTP %{http_code}' http://localhost:80/notes/second-note.html")

ssh.close()
print("\nDone!")
