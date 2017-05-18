const proxy = require('http-proxy-middleware');

module.exports = function ui5ProxyMiddleware(c, o) {
  "use strict";
    /**
     * modify here to set node proxy server
     *
     * documention see https://github.com/chimurai/http-proxy-middleware
     */
  return [
    proxy("/resources", {
      target: "https://<%= ui5Domain %>",
      changeOrigin: true,
      onProxyRes: function(p) {
        p.headers["cache-control"] = "public, max-age=31536000";
      }
    }),
    proxy("/test-resources", {
      target: "https://<%= ui5Domain %>",
      changeOrigin: true,
      onProxyRes: function(p) {
        p.headers["cache-control"] = "public, max-age=31536000";
      }
    }),
    // Above proxy are not necessary
    proxy("/destinations/northwind", {
      target: "http://services.odata.org/",
      auth: "suntheo:12345678",
      pathRewrite: {
        '^/destinations/northwind': '/'
      },
      changeOrigin: true
    })
  ];

};