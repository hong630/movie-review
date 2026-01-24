// src/types/vue-router.d.ts
import { Router, RouteLocationNormalizedLoaded } from 'vue-router';

declare module 'vue' {
    interface ComponentCustomProperties {
        $route: RouteLocationNormalizedLoaded;
        $router: Router;
    }
}

export {};
