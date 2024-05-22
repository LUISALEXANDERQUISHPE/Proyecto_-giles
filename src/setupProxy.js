// En setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:80', // Cambia esto al puerto correcto donde está tu servidor PHP
      changeOrigin: true,
    })
  );
};
