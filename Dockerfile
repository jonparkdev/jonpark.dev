# Plain static-file-server image (ADR 0001): it only packages the pre-built
# site in dist/ and serves it on one port. Nothing host-specific lives here,
# so the same image runs on Fly.io now and in the k8s homelab later.
#
# Build the site first (npm run build), then: docker build -t jonpark-dev .
# Smoke run: docker run --rm -p 8080:8080 jonpark-dev && curl localhost:8080
FROM joseluisq/static-web-server:2-alpine

ENV SERVER_ROOT=/public \
    SERVER_PORT=8080 \
    SERVER_HOST=0.0.0.0

COPY dist/ /public/

EXPOSE 8080
