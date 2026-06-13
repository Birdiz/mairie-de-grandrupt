#!/usr/bin/env bash
#
# Sauvegarde des données runtime de Payload : base SQLite (volume mairie-data)
# + médias téléversés (volume mairie-media). Produit une archive .tar.gz horodatée.
#
# Usage :   ./scripts/backup.sh [dossier_de_sortie]   (défaut : ./backups)
# Restauration : voir le README (extraire l'archive dans les volumes, puis redémarrer).
#
# Exemple de cron quotidien (3h du matin) :
#   0 3 * * * cd /chemin/vers/app && ./scripts/backup.sh /var/backups/grandrupt >> /var/log/grandrupt-backup.log 2>&1
set -euo pipefail

OUT_DIR="${1:-./backups}"
STAMP="$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT_DIR"
OUT_ABS="$(cd "$OUT_DIR" && pwd)"

# Les volumes sont préfixés par le nom du projet Compose ; on les retrouve par suffixe.
data_vol="$(docker volume ls -q | grep -E 'mairie-data$' | head -1 || true)"
media_vol="$(docker volume ls -q | grep -E 'mairie-media$' | head -1 || true)"

if [ -z "$data_vol" ]; then
  echo "✗ Volume 'mairie-data' introuvable. Le conteneur a-t-il déjà démarré ?" >&2
  exit 1
fi

archive="grandrupt-backup-$STAMP.tar.gz"
# Conteneur jetable qui monte les volumes en lecture seule et archive leur contenu.
docker run --rm \
  -v "$data_vol":/data:ro \
  ${media_vol:+-v "$media_vol":/media:ro} \
  -v "$OUT_ABS":/backup \
  alpine sh -c "tar czf /backup/$archive -C / data $([ -n '$media_vol' ] && echo media)"

echo "✓ Sauvegarde créée : $OUT_ABS/$archive"
