# Anime Clothing E-Commerce Platform

## Project Overview
An anime-themed clothing e-commerce website with modern authentication and shopping features.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Firebase Authentication & Firestore
- Hosting: Netlify
- Payment: Razorpay

## Deployment Instructions

### Prerequisites
- GitHub Account
- Netlify Account
- Firebase Account

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password, Google Sign-In)
3. Create Firestore database
4. Copy Firebase configuration

### Netlify Deployment
1. Connect GitHub repository
2. Set build settings:
   - Build command: `echo 'No build step needed'`
   - Publish directory: `src`

### Environment Variables
Set the following in Netlify:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`

## Local Development
1. Clone repository
2. Open `src/js/firebase-config.js`
3. Replace Firebase config with your credentials
4. Run on local server

## Testing
- Comprehensive test suite in `src/js/test-suite.js`
- Runs automatically in development environment

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
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License
MIT License
