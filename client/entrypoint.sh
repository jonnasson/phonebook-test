#!/bin/sh
# Extract the DNS resolver from /etc/resolv.conf for nginx dynamic resolution
export RESOLVER=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
exec /docker-entrypoint.sh "$@"
