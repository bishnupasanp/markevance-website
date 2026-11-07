#!/usr/bin/env bash
set -euo pipefail

repository_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
website_dir="/home/pmnmmwbp/markevance.com"
deployment_dir="/home/pmnmmwbp/markevance-deployments"

# These guards prevent deployment to a different account, checkout, or domain.
test "$(id -un)" = "pmnmmwbp"
test "$repository_dir" = "/home/pmnmmwbp/repositories/markevance-website"
test "$(readlink -f -- "$website_dir")" = "$website_dir"
test -d "$website_dir"
command -v rsync >/dev/null
command -v flock >/dev/null

umask 022
mkdir -p -- "$deployment_dir"
chmod 700 -- "$deployment_dir"
exec 9>"$deployment_dir/deployment.lock"
flock -n 9

cd -- "$repository_dir"
git diff --quiet
git diff --cached --quiet
revision=$(git rev-parse HEAD)

# The cpanel branch contains the locally validated build and its integrity list.
# Shared-host process limits prevent a reliable Node.js build on this account.
test "$(git branch --show-current)" = "cpanel"
test -f "$repository_dir/cpanel-release.sha256"
test -f "$repository_dir/cpanel-source-revision.txt"
test -f "$repository_dir/dist/index.html"
test -f "$repository_dir/dist/.htaccess"
test -z "$(find "$repository_dir/dist" -type l -print -quit)"
sha256sum --check --strict "$repository_dir/cpanel-release.sha256" >/dev/null
test "$(find "$repository_dir/dist" -type f | wc -l)" -eq "$(wc -l < "$repository_dir/cpanel-release.sha256")"

release_dir=$(mktemp -d "$deployment_dir/release-$(date -u +%Y%m%dT%H%M%SZ)-${revision:0:12}-XXXXXX")
tar -czf "$release_dir/website-before.tar.gz" -C "$website_dir" .
tar -tzf "$release_dir/website-before.tar.gz" >/dev/null
printf '%s\n' "$revision" > "$release_dir/source-revision.txt"
cp "$repository_dir/cpanel-source-revision.txt" "$release_dir/build-source-revision.txt"
printf 'Backup verified at %s\n' "$release_dir/website-before.tar.gz"

# Publish assets first so both the old and new HTML can load their bundles.
# Existing verification files and Apache redirects stay in their current paths.
rsync -a --no-owner --no-group --chmod=D755,F644 \
  --exclude='index.html' --exclude='.htaccess' --exclude='.well-known/' \
  "$repository_dir/dist/" "$website_dir/"
rsync -a --no-owner --no-group --chmod=D755,F644 \
  --exclude='/index.html' --exclude='.htaccess' --exclude='.well-known/' \
  "$repository_dir/dist/" "$website_dir/"

if ! test -f "$website_dir/.htaccess"; then
  install -m 644 "$repository_dir/dist/.htaccess" "$website_dir/.htaccess"
fi

# Switch the homepage after the other pages and their assets are available.
homepage_temp=$(mktemp "$website_dir/.markevance-index.XXXXXX")
install -m 644 "$repository_dir/dist/index.html" "$homepage_temp"
mv -f -- "$homepage_temp" "$website_dir/index.html"

printf '%s\n' "$revision" > "$deployment_dir/current-revision.txt"
printf '%s\n' "$release_dir" > "$deployment_dir/current-backup.txt"
printf 'Deployed revision %s to %s\n' "$revision" "$website_dir"
