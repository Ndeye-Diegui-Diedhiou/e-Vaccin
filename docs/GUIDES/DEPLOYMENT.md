# 🚀 Guide de Déploiement - e-Vaccin

## Plateformes de Déploiement Supportées

### 1. **Vercel** (Recommandé pour Vite/React)

#### Avantages
- ✅ Déploiement gratuit
- ✅ Performance excellente
- ✅ CI/CD intégré
- ✅ Domaine personnalisé gratuit
- ✅ SSL automatique

#### Étapes

1. **Créer un compte**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Déployer**
   ```bash
   vercel
   ```

3. **Configurer variables d'env**
   - Aller sur vercel.com
   - Projet → Settings → Environment Variables
   - Ajouter `REACT_APP_API_URL=...`

---

### 2. **Netlify**

#### Avantages
- ✅ Déploiement easy
- ✅ CI/CD avec GitHub
- ✅ Previews automatiques
- ✅ Serverless functions

#### Étapes

1. **Connecter GitHub**
   - netlify.com → Sign up

2. **Configurer build**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Ajouter env variables**
   - Site settings → Build & deploy → Environment

---

### 3. **GitHub Pages**

#### Avantages
- ✅ Gratuit
- ✅ Hébergement git-friendly
- ✅ SSL inclus
- ✅ CDN global

#### Étapes

1. **Modifier package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/e-vaccin",
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

2. **Installer gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Déployer**
   ```bash
   npm run deploy
   ```

---

### 4. **Heroku + Node Server**

Si vous avez un backend Heroku:

```javascript
// server.js
import express from 'express';
import path from 'path';

const app = express();

// Serve static files from dist
app.use(express.static('dist'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

---

### 5. **Docker + Cloud Run / ECS / K8s**

#### Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Build & Push
```bash
docker build -t evaccin:1.0 .
docker run -p 3000:3000 evaccin:1.0
```

---

## 📋 Pre-Deployment Checklist

- [ ] Tester localement: `npm run build && npm run preview`
- [ ] Vérifier variables d'env dans `.env.production`
- [ ] Lancer tests unitaires
- [ ] Audit de sécurité
- [ ] Vérifier performance (Lighthouse)
- [ ] Tester sur mobile
- [ ] Vérifier responsive design
- [ ] Compression images optimisée
- [ ] Cache busting configuré
- [ ] Erreurs console éliminées

---

## 🔐 Production Environment

### Variables d'env requises

```bash
# .env.production
REACT_APP_API_URL=https://api.evaccin.sn
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=error
REACT_APP_SENTRY_DSN=https://...  # Error tracking
REACT_APP_GA_ID=UA-...            # Google Analytics
```

---

## 🎯 Performance Optimization

### Build Optimization

```javascript
// vite.config.js - déjà optimisé
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,  // Production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### Lighthouse Score Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 📊 Monitoring & Analytics

### Sentry (Error Tracking)

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

export default Sentry.withProfiler(App);
```

### Google Analytics

```javascript
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - run: npm install
      - run: npm run build
      - run: npm run test
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod
```

---

## 🌐 DNS & Domain

### Configurer domaine personnalisé

**Pour Vercel:**
1. Vercel → Project Settings → Domains
2. Ajouter votre domaine
3. Mettre à jour DNS records

**Exemple DNS Records:**
```
Type: A
Name: evaccin
Value: 76.76.19.165

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔒 HTTPS & SSL

- ✅ Tous les fournisseurs incluent SSL gratuit
- ✅ Redirect HTTP → HTTPS automatique
- ✅ Certificate auto-renewal

---

## 📱 Performance Tips

1. **Code Splitting**
   ```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Image Optimization**
   - Utiliser WebP
   - Lazy load images
   - Responsive images

3. **Caching Strategy**
   - Service Worker
   - HTTP caching headers
   - CDN edge caching

---

## 🆘 Troubleshooting

### Build fails
```bash
npm run build --verbose
# Check errors et fix
```

### 404 errors
- Vérifier basePath dans Vite config
- SPA fallback configuré

### Slow performance
```bash
npm run build
npm run preview
# Utiliser DevTools pour analyser
```

---

## 📞 Support Déploiement

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

---

**Bon déploiement!** 🎉
