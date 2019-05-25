const proxy = require('http-proxy-middleware');

module.exports =
  /**
   * modify here to set node proxy server
   *
   * documention see https://github.com/chimurai/http-proxy-middleware
   */
  [
    proxy("/destinations/northwind", {
      target: "https://services.odata.org/",
      // with http basic auth if necessary
      auth: "username:password",
      pathRewrite: {
        '^/destinations/northwind': '/'
      },
      changeOrigin: true
    })
  ];
