# Anime Threads E-Commerce Platform

## Project Overview
An anime-themed clothing e-commerce website with modern authentication and shopping features.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Firebase Authentication & Firestore
- Hosting: Netlify
- Payment: Razorpay

## Deployment Configuration

### GitHub Secrets Configuration
To deploy this project, you need to configure the following GitHub Secrets:

1. `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
2. `NETLIFY_SITE_ID`: Your Netlify site ID
3. `FIREBASE_API_KEY`: Firebase project API key
4. `FIREBASE_AUTH_DOMAIN`: Firebase authentication domain
5. `FIREBASE_PROJECT_ID`: Firebase project ID

### Obtaining Secrets

#### Netlify Tokens
1. Log in to Netlify
2. Go to User Settings → Applications
3. Create a new personal access token
4. Copy the token and add it to GitHub Secrets

#### Firebase Configuration
1. Go to Firebase Console
2. Select your project
3. Project Settings → Service Accounts
4. Generate a new private key

### Deployment Workflow
The GitHub Actions workflow (`deploy.yml`) handles:
- Repository checkout
- Node.js setup
- Dependency installation
- Environment configuration
- Netlify deployment

### Troubleshooting
- Ensure all GitHub Secrets are correctly set
- Verify Netlify and Firebase configurations
- Check GitHub Actions logs for detailed error messages

## Local Development

### Prerequisites
- Node.js 16+
- npm
- Firebase Project
- Netlify Account

### Setup
1. Clone the repository
2. Run `npm install`
3. Configure environment variables
4. Run `npm start`

## Features
- User Authentication
- Google Sign-In
- Responsive Design
- Cart Management
- Checkout Process

## Security
- Route protection
- Error handling
- Logging utility

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
MIT License
