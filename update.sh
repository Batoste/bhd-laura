#!/bin/bash

echo "🔄 Build du projet React..."
npm run build

cp -rf build/* .

echo "✅ Build terminé. Ajout des fichiers..."
git add -A

echo "📦 Commit..."
git commit -m "🚀 Mise à jour du jeu anniversaire"

echo "⬆️ Push vers GitHub..."
git push

echo "🎉 Déploiement terminé ! Recharge ton GitHub Pages dans 1 min."
