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

# Upload
print("=== Uploading ===")
sftp = ssh.open_sftp()
sftp.put("D:/MySite/notes_public.tar.gz", "/home/ubuntu/notes_public.tar.gz")
sftp.close()
print("Done")

# Extract
print("\n=== Extracting ===")
run("cd ~/notes-content && rm -rf public && tar xzf ~/notes_public.tar.gz && rm ~/notes_public.tar.gz")
run("ls ~/notes-content/public/ | head -5")

# No need to restart containers since notes are mounted as volume

# Verify navigation links work
print("\n=== Verify ===")
out = run("curl -s http://localhost:80/notes/ | grep -o 'href=\"[^\"]*first-note[^\"]*\"'")
if not out:
    print("No direct HTML links found (explorer is JS-generated, OK)")
out = run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80/notes/first-note.html")
print()
out = run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80/notes/second-note.html")

print("\n\nDone! Refresh http://gianniiss.top/notes/ and try clicking notes")
ssh.close()
