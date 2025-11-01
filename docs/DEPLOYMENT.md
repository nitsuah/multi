# Deployment Guide

## Environment Variables

### Netlify Frontend Configuration

Add these environment variables in your Netlify dashboard (Site settings → Environment variables):

```bash
# WebSocket Server URL
VITE_SOCKET_SERVER_URL=https://your-websocket-server.com

# Or leave empty to use the same domain as the frontend
# VITE_SOCKET_SERVER_URL=
```

### WebSocket Server Configuration

For your Node.js server (server.js), set these environment variables:

```bash
# Server Port
PORT=4444

# Allowed CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://darkmoon-dev.netlify.app,https://deploy-preview-*--darkmoon-dev.netlify.app
```

## Deployment Steps

### 1. Frontend (Netlify)

The frontend auto-deploys on push to `dev-phase-3` branch.

**Build Settings:**

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18.x or higher

**Environment Variables:**

- `VITE_SOCKET_SERVER_URL` - Optional, defaults to `window.location.origin`

### 2. WebSocket Server

Deploy your Node.js server (server.js) to a platform like:

- **Render.com** (recommended for WebSockets)
- **Railway.app**
- **Heroku**
- **Fly.io**

**Required settings:**

- Start command: `npm start`
- Port: Set by platform (default 4444)
- Environment: Add `ALLOWED_ORIGINS` with your Netlify URL

### 3. Health Check

The server exposes a `/health` endpoint that returns:

```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "connections": 0
}
```

Use this for monitoring and uptime checks.

## Testing Production WebSocket

1. Deploy server and note the URL (e.g., `https://darkmoon-server.onrender.com`)
2. Set `VITE_SOCKET_SERVER_URL` in Netlify to your server URL
3. Redeploy frontend
4. Test multiplayer at [https://deploy-preview-34--darkmoon-dev.netlify.app/play](https://deploy-preview-34--darkmoon-dev.netlify.app/play)
5. Check browser console for connection status

## Troubleshooting

### WebSocket Connection Failed

**Symptoms:** "Disconnected - Reconnecting..." message

**Solutions:**

1. Check server is running: `curl https://your-server.com/health`
2. Verify CORS origins include your Netlify URL
3. Check browser console for specific errors
4. Ensure server supports WebSocket upgrades (not just HTTP)

### CORS Errors

**Symptoms:** Browser blocks requests with CORS error

**Solutions:**

1. Add Netlify URL to `ALLOWED_ORIGINS` on server
2. Use wildcard for preview deploys: `https://deploy-preview-*--darkmoon-dev.netlify.app`
3. Restart server after changing environment variables

### Build Failures

**Symptoms:** Netlify build fails

**Solutions:**

1. Check Node version is 18.x or higher
2. Run `npm install` locally to verify dependencies
3. Check build logs for specific errors
4. Ensure all required files are committed to git

## Current Status

✅ Health check endpoint implemented
✅ CORS with wildcard pattern matching
✅ Environment variable support
✅ Vite config optimized
✅ Solo mode working (no server needed)
⚠️ Multiplayer server deployment pending

## Next Steps (Multiplayer Only)

1. Deploy WebSocket server to Render/Railway/Fly.io
2. Configure `VITE_SOCKET_SERVER_URL` in Netlify
3. Test multiplayer functionality
4. Monitor health check endpoint
5. Set up uptime monitoring

**Note**: Solo mode works perfectly without any server deployment.
