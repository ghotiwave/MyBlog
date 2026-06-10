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

# Check nginx error log
print("=== Nginx error log ===")
run("docker exec blog-frontend-1 tail -20 /var/log/nginx/error.log 2>&1")

# Check file exists in container
print("\n=== Check files in container ===")
run("docker exec blog-frontend-1 ls -la /usr/share/nginx/notes/ 2>&1 | head -15")

# Check nginx config
print("\n=== Nginx config ===")
run("docker exec blog-frontend-1 cat /etc/nginx/conf.d/default.conf 2>&1")

ssh.close()
