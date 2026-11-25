# Deploy script for Vercel
# Stage changes, commit (if any), push, then deploy to Vercel production

# Stage all changes
git add -A

# Commit if there are staged changes
if (git diff --cached --quiet) {
  echo "No changes to commit."
} else {
  git commit -m "Auto commit before Vercel deploy"
}

# Push to remote
git push origin main

# Deploy with Vercel CLI (production)
vercel --prod
