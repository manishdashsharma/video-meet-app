# Video Meet App

A professional video conferencing application built with React and Agora RTC SDK. Features real-time video/audio calls, screen sharing, and a modern, polished UI.

![Video Meet App](https://img.shields.io/badge/React-18.3.1-blue) ![Agora RTC](https://img.shields.io/badge/Agora-RTC-green) ![Vite](https://img.shields.io/badge/Vite-6.0.1-purple)

## Features

- **Real-time Video & Audio Calls** - High-quality video conferencing powered by Agora RTC
- **Screen Sharing** - Share your screen with other participants
- **Professional UI** - Modern, clean interface with custom color palette
- **Mic & Camera Controls** - Toggle audio and video with visual feedback
- **Multi-participant Support** - Connect with multiple users simultaneously
- **Responsive Grid Layout** - Automatic layout adjustment based on participant count
- **Route-based Navigation** - Separate join screen and video call interface

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Agora RTC React SDK** - Real-time communication
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling

## Prerequisites

Before running this project, you need:

1. **Node.js** (v16 or higher)
2. **Agora Account** - Sign up at [Agora.io](https://www.agora.io/)
3. **Agora App ID** - Create a project in Agora Console to get your App ID

## Installation

1. Clone the repository:
```bash
git clone https://github.com/manishdashsharma/video-meet-app.git
cd video-meet-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Joining a Call

1. On the home page (`/`), you'll see the join screen
2. Enter your **Agora App ID**
3. Enter a **Channel Name** (participants with the same channel name will join the same room)
4. Optionally enter a **Token** (required for production environments)
5. Click **Join Channel**

### During a Call

- **Mic Button** - Toggle your microphone on/off
- **Camera Button** - Toggle your camera on/off
- **Share Button** - Start/stop screen sharing
- **More Button** - Additional options (placeholder)
- **Leave Button** - Exit the call and return to join screen

### URL Structure

- `/` - Join screen
- `/video-call/channel/:channelName` - Video call interface

## Configuration

### Getting Your Agora App ID

1. Sign up at [Agora.io](https://console.agora.io/)
2. Create a new project
3. Copy your App ID from the project settings
4. Use it in the join form

### Token Authentication (Optional)

For production environments, it's recommended to use token authentication:

1. Enable App Certificate in your Agora project
2. Generate a token using Agora's token server
3. Enter the token in the join form

## Color Palette

The app uses a professional color scheme:

- **Primary Blue**: `#142C8E` - Main branding, buttons
- **Navy**: `#1C2C56` - Header, controls
- **Background**: `#3D3D3D` - Main background
- **Alert Red**: `#ED5C5C` - Leave button, muted states
- **Light Blue**: `#90B8F8` - Input borders, accents
- **Success Green**: `#0DC38A` - Screen sharing active state
- **Dark**: `#0A0A0A` - Control bar background


Built with ❤️ using React and Agora RTC
