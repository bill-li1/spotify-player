# The Prettiest Spotify Web Player

Welcome to the repository of what we boldly call "The Prettiest Spotify Web Player" – a unique, visually enchanting web player designed to elevate your Spotify listening experience.

https://github.com/bill-li1/spotify-player/assets/38056522/82a0b852-8d0e-4017-81bf-12d37b67975b

## Getting Started

### Prerequisites

- A Spotify account: You need a Spotify account to access their Web API.
- Spotify App Registration: You must register your application on the Spotify Developer Dashboard. Upon registration, you'll receive a Client ID and Client Secret, which are needed to authenticate your app with the Spotify API.

### Installation

1. Clone the repository

```bash
git clone git@github.com:bill-li1/spotify-player.git
```

2. Install NPM Packages

```bash
npm install
```

3. Create a .env.local file in the root of your project and insert your Spotify credentials and other necessary environment variables as follows:

```
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_ID=YOUR_CLIENT_ID
NEXT_PUBLIC_CLIENT_SECRET=YOUR_CLIENT_SECRET
JWT_SECRET=super_secret_value
```
