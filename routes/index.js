const infoRoute = require('./info.route');
const downloadRoute = require('./download.route');
const router = require('express').Router();

const routes = [
  {
    path: '/videoInfo',
    route: infoRoute,
  },
  {
    path: '/download',
    route: downloadRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;