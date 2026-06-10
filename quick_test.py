import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("106.54.211.108", username="ubuntu", password="Zcnhcgd18", timeout=15)

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    print(out)
    if err: print(err)

run("curl -s -o /dev/null -w '%{http_code}' http://localhost:80/notes/")
print()
run("curl -s -o /dev/null -w '%{http_code}' http://localhost:80/notes/first-note.html")
print()
run("curl -s http://localhost:80/notes/ | grep -o 'href=\"/\"' | head -1")
ssh.close()
