# Porsche Game Domain Setup Guide
## 🌐 porsche.911fund.io Configuration

### Option 1: Nginx Reverse Proxy (Recommended)
```bash
# Install nginx
sudo apt update && sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/porsche-game
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name porsche.911fund.io;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req zone=api burst=20 nodelay;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS for game assets
        add_header Access-Control-Allow-Origin *;
    }
}
```

**Enable & Configure:**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/porsche-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Add rate limiting to main nginx config
sudo nano /etc/nginx/nginx.conf
# Add inside http block:
# limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### Option 2: Cloudflare Tunnel (Zero Trust)
```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate with Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create porsche-game

# Configure tunnel
nano ~/.cloudflared/config.yml
```

**Cloudflare Config:**
```yaml
tunnel: <tunnel-id>
credentials-file: ~/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: porsche.911fund.io
    service: http://localhost:8080
  - service: http_status:404
```

**Start tunnel:**
```bash
cloudflared tunnel route dns porsche-game porsche.911fund.io
cloudflared tunnel run porsche-game
```

### Option 3: Direct Port + Firewall (Simple)
```bash
# Open port 8080 in firewall
sudo ufw allow 8080/tcp

# Update DNS to point porsche.911fund.io to your server IP
# Then access via: http://porsche.911fund.io:8080
```

### SSL/HTTPS Setup (Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d porsche.911fund.io

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Enhancements
```bash
# Create systemd service for game server
sudo nano /etc/systemd/system/porsche-game.service
```

**Systemd Service:**
```ini
[Unit]
Description=Porsche 911 Desert Dash Game Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/clawd
ExecStart=/usr/bin/python3 -m http.server 8080 --bind 127.0.0.1
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Enable service:**
```bash
sudo systemctl enable porsche-game.service
sudo systemctl start porsche-game.service
```

## 🚨 Security Checklist
- ✅ Bind game server to localhost only (127.0.0.1)
- ✅ Use reverse proxy (nginx/cloudflare) for public access
- ✅ Enable HTTPS with SSL certificate  
- ✅ Implement rate limiting
- ✅ Add security headers
- ✅ Regular updates and monitoring
- ✅ DDoS protection via Cloudflare

## 📱 Mobile Testing URLs
Once deployed:
- **Desktop:** https://porsche.911fund.io
- **Mobile:** Same URL with touch controls
- **Cross-platform compatibility confirmed**

**Choose Option 1 (Nginx) for full control or Option 2 (Cloudflare) for zero-config DDoS protection!**