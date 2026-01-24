import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import WatchlistPage from "@/pages/WatchlistPage.vue";
import WatchedPage from "@/pages/WatchedPage.vue";
import StatsPage from "@/pages/StatsPage.vue";


const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/search' },
    { path: '/search', component: SearchPage },
    { path: '/watchlist', component: WatchlistPage },
    { path: '/watched', component: WatchedPage },
    { path: '/stats', component: StatsPage },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
