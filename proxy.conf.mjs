/**
 * Transmet le Host du navigateur (ex. localhost:4200 ou 192.168.x.x:4200) au backend.
 * Sans cela, Spring OAuth2 voit Host=localhost:8087 et envoie à Google une redirect_uri
 * vers :8087 → erreur redirect_uri_mismatch si la console n’autorise que :4200.
 */
function withBrowserForwardedHeaders(options) {
  return {
    ...options,
    secure: options.secure ?? false,
    changeOrigin: options.changeOrigin ?? true,
    configure(proxy) {
      if (typeof options.configure === 'function') {
        options.configure(proxy);
      }
      proxy.on('proxyReq', (proxyReq, req) => {
        const host = req.headers.host;
        if (!host) return;
        proxyReq.setHeader('X-Forwarded-Host', host);
        proxyReq.setHeader('X-Forwarded-Proto', 'http');
        const colon = host.lastIndexOf(':');
        if (colon > 0) {
          const port = host.slice(colon + 1);
          if (/^\d+$/.test(port)) {
            proxyReq.setHeader('X-Forwarded-Port', port);
          }
        }
      });
    },
  };
}

/** 127.0.0.1 évite sous Windows que Node tente ::1 (IPv6) alors que Spring n’écoute qu’en IPv4. */
function p(port) {
  return withBrowserForwardedHeaders({ target: `http://127.0.0.1:${port}` });
}

// All API calls go through the API Gateway on port 8080
const gateway = p(8080);

export default {
  '/uploads': p(8087),
  '/api': gateway,
  '/oauth2/authorization': p(8087),
  '/oauth2/authorize': p(8087),
  '/login': p(8087),
  '/logout': p(8087),
};
