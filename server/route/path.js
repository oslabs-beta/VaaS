"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function path(url) {
    const allRoutes = {
        '/user': {
            methods: ['GET', 'PUT', 'DELETE']
        },
        '/auth': {
            methods: ['GET', 'POST', 'PUT']
        },
        '/cluster': {
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        '/prom': {
            methods: ['GET']
        },
        '/faas': {
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        '/faas/invoke': {
            methods: ['POST']
        },
        '/gateway': {
            methods: ['GET']
        },
        '/alert': {
            methods: ['GET']
        },
        '/github': {
            methods: ['GET', 'POST']
        },
        '/gcheck': {
            methods: ['POST']
        }
    };
    return allRoutes[url];
}
exports.default = path;
//# sourceMappingURL=path.js.map