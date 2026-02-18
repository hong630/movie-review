import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import WatchlistPage from "@/pages/WatchlistPage.vue";
import WatchedPage from "@/pages/WatchedPage.vue";
import StatsPage from "@/pages/StatsPage.vue";
import ReviewEditorPage from "@/pages/ReviewEditorPage.vue";
import PointPage from '@/pages/PointPage.vue';
import ShopPage from "@/pages/ShopPage.vue";


const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/search' },
    { path: '/search', component: SearchPage },
    { path: '/watchlist', component: WatchlistPage },
    { path: '/watched', component: WatchedPage },
    { path: '/stats', component: StatsPage },
    { path: '/movie/:movieId/review', component: ReviewEditorPage },
    { path: '/point', name: 'PointPage', component: PointPage },
    { path: '/shop', name: 'ShopPage', component: ShopPage }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
