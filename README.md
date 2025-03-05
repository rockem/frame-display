
# Eli Segal Photography Portfolio

This is a photography portfolio website for showcasing galleries of images.

## Project info

**URL**: https://lovable.dev/projects/10c20928-f79e-45aa-ac1d-a12d6f0623d4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/10c20928-f79e-45aa-ac1d-a12d6f0623d4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment

### GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages when changes are pushed to the main branch. The deployment workflow is defined in `.github/workflows/publish.yaml`.

To set up GitHub Pages deployment:

1. Ensure your repository has GitHub Pages enabled in the repository settings
2. Make sure the GitHub workflow has the necessary permissions (Settings > Actions > General > Workflow permissions)
3. For the first deployment, you may need to run the workflow manually from the Actions tab

Once deployed, your site will be available at: `https://<your-github-username>.github.io/<repository-name>/`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- GitHub Actions for CI/CD

## Custom domain setup

If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
