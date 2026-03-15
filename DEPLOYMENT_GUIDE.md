# 🚀 Uber Clone Deployment Guide

This guide provides step-by-step instructions for deploying the Uber clone project as a permanent website using Docker and Nginx. This setup ensures a scalable, maintainable, and production-ready environment.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your server:

- **Docker:** [Install Docker](https://docs.docker.com/engine/install/)
- **Docker Compose:** [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Nginx:** [Install Nginx](https://nginx.org/en/docs/install.html)
- **Git:** [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## 2. Project Setup

### 2.1. Clone the Repository

Clone the project repository to your server:

```bash
git clone <your-repository-url>
cd uber-clone
```

### 2.2. Environment Variables

Create a `.env` file in the root of the project with the following content:

```
# Backend Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
GOOGLE_MAPS_API=your_google_maps_api_key_here

# Frontend Configuration (will be passed to Docker)
VITE_API_BASE_URL=https://your-domain.com/api
VITE_SOCKET_URL=https://your-domain.com
```

**Important:**
- Replace `your_super_secret_jwt_key_change_this` with a strong, unique secret.
- Replace `your_google_maps_api_key_here` with your actual Google Maps API key.
- Replace `https://your-domain.com` with your actual domain name.

## 3. Build and Run with Docker Compose

### 3.1. Build the Docker Images

From the root of the project, build the Docker images for the backend and frontend:

```bash
docker-compose build
```

This command will:
- Build the backend image using `backend/Dockerfile`
- Build the frontend image using `frontend/Dockerfile`

### 3.2. Start the Services

Start all services (MongoDB, backend, frontend) in detached mode:

```bash
docker-compose up -d
```

This will:
- Start a MongoDB container
- Start the backend container and connect it to MongoDB
- Start the frontend container and connect it to the backend

### 3.3. Verify Services are Running

Check the status of the running containers:

```bash
docker-compose ps
```

You should see `mongodb`, `backend`, and `frontend` containers with a `running` status.

## 4. Configure Nginx as a Reverse Proxy

### 4.1. Create Nginx Configuration

Create a new Nginx configuration file for your site:

```bash
sudo nano /etc/nginx/sites-available/uber-clone
```

Paste the following configuration into the file, replacing `your-domain.com` with your domain:

```nginx
upstream backend {
    server 127.0.0.1:3000;
}

upstream frontend {
    server 127.0.0.1:5173;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (recommended for production)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 4.2. Enable the Site

Create a symbolic link to enable the new site configuration:

```bash
sudo ln -s /etc/nginx/sites-available/uber-clone /etc/nginx/sites-enabled/
```

### 4.3. Test and Restart Nginx

Test your Nginx configuration for syntax errors:

```bash
sudo nginx -t
```

If the test is successful, restart Nginx to apply the changes:

```bash
sudo systemctl restart nginx
```

## 5. DNS Configuration

Point your domain's A record to your server's IP address. This will allow users to access your site via your domain name.

## 6. Secure with SSL (Recommended)

For a production website, it is highly recommended to secure your site with an SSL certificate (HTTPS).

### 6.1. Install Certbot

Certbot is a free, automated tool for obtaining and renewing SSL certificates from Let's Encrypt.

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 6.2. Obtain SSL Certificate

Run Certbot to automatically obtain and configure an SSL certificate for your domain:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot will automatically update your Nginx configuration to handle HTTPS and redirect HTTP traffic.

## 7. Maintenance and Updates

### 7.1. Updating the Application

To update your application with the latest code:

1. Pull the latest changes from your Git repository:
   ```bash
   git pull
   ```

2. Rebuild the Docker images:
   ```bash
   docker-compose build
   ```

3. Restart the services:
   ```bash
   docker-compose up -d
   ```

### 7.2. Viewing Logs

To view the logs for a specific service:

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# MongoDB logs
docker-compose logs -f mongodb
```

### 7.3. Stopping the Application

To stop all services:

```bash
docker-compose down
```

## 8. Troubleshooting

- **502 Bad Gateway:** This usually means the backend or frontend service is not running correctly. Check the logs (`docker-compose logs -f <service-name>`) for errors.
- **Connection Refused:** Ensure that the ports are correctly mapped in `docker-compose.yml` and that Nginx is configured to proxy to the correct ports.
- **Database Connection Issues:** Verify that the `DB_CONNECT` environment variable in `docker-compose.yml` is correct and that the MongoDB container is running.

---

**Deployment completed on:** February 24, 2026
**Status:** ✅ Ready for Production
