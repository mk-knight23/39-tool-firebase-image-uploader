#!/bin/bash

# Firebase Image Uploader - Deployment Script
# Usage: ./deploy.sh [firebase|netlify]

set -e

PROJECT_NAME="39-tool-firebase-image-uploader"

case "${1:-firebase}" in
  firebase)
    echo "🚀 Deploying to Firebase Hosting..."
    npx firebase deploy --only hosting
    ;;
  netlify)
    echo "🚀 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist/facebook-clone/browser
    ;;
  *)
    echo "Usage: ./deploy.sh [firebase|netlify]"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"
echo "🌐 Live URL will be provided by the deployment platform."
