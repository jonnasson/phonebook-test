#!/bin/sh
# Extract the DNS resolver from /etc/resolv.conf for nginx dynamic resolution
# Wrap IPv6 addresses in brackets as required by nginx resolver directive
RAW=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
case "$RAW" in
  *:*) export RESOLVER="[$RAW]" ;;
  *)   export RESOLVER="$RAW" ;;
esac
exec /docker-entrypoint.sh "$@"
