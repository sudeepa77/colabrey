# Mobile QR Code Access - Setup Guide

## 🎯 Purpose
This guide helps you access your localhost development site on your mobile device using the QR code feature.

## 📱 Quick Setup

### Step 1: Find Your Computer's IP Address

#### Windows:
1. Open Command Prompt (Win + R, type `cmd`)
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your WiFi adapter
4. Example: `192.168.1.100`

#### Mac:
1. Open Terminal
2. Run: `ifconfig | grep "inet " | grep -v 127.0.0.1`
3. Look for your local IP (usually starts with 192.168.x.x)

#### Linux:
1. Open Terminal
2. Run: `hostname -I` or `ifconfig`
3. Look for your local IP address

### Step 2: Run Development Server with Network Access

Instead of the regular `npm run dev`, use:

```bash
npm run dev:network
```

This will start the server and make it accessible on your local network.

### Step 3: Access on Mobile

1. Make sure your phone is connected to the **same WiFi network** as your computer
2. In the dashboard, click on "Show QR Code" in the Mobile QR Card
3. The QR code will automatically use your network IP
4. Scan the QR code with your phone's camera
5. You'll be redirected to the login page (if not logged in)

## 🔧 Troubleshooting

### "Site can't be reached" Error
- ✅ Verify both devices are on the same WiFi network
- ✅ Check if you're using `npm run dev:network` (not just `npm run dev`)
- ✅ Verify your firewall isn't blocking port 3000
- ✅ Try accessing `http://YOUR-IP:3000` directly in your phone's browser

### Firewall Issues (Windows)
If you get a Windows Firewall prompt, click "Allow access"

### Still Not Working?
1. Restart the dev server with `npm run dev:network`
2. Double-check your IP address hasn't changed
3. Try accessing from your phone's browser manually: `http://YOUR-IP:3000`

## 🌐 How It Works

1. **Authentication Flow**: 
   - QR code points to the home page (`http://YOUR-IP:3000`)
   - If not logged in → redirects to `/login`
   - After login → redirects to `/dashboard`

2. **Network Access**:
   - `--hostname 0.0.0.0` makes Next.js listen on all network interfaces
   - Your computer becomes accessible on the local network
   - Mobile devices on the same WiFi can connect

## 📝 Notes

- The QR code automatically detects if you're using a network IP
- If using localhost, it will show instructions to set up network access
- This only works on your local network (not over the internet)
- For production, you'd deploy to a hosting service with a public URL

## 🚀 Pro Tip

Add this to your workflow:
1. Start dev server: `npm run dev:network`
2. Note the "Network" URL shown in the terminal
3. Use the QR code feature for quick mobile testing
4. No need to manually type URLs on your phone!
