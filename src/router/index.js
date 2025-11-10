import { useAuth } from '@/composables/useAuth';
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
    history: createWebHistory('/proyecto-final-portafolio'),
    routes: [
        { path: '/', name: 'home', component: HomeView},
        { path: '/login', name: 'login', component: LoginView },
        { path: '/admin', name: 'admin', component: ()=> import('@/views/AdminView.vue'), meta: {requiresAuth: true} },
        { path: '/test', component: () => import('@/componentes/TestFirestoreComponent.vue') },
        { path: '/:pathMatch(.*)*', redirect: '/' },

    ]
});


router.beforeEach(async (to) => {
    const { user, waitForAuthReady } = useAuth();
    await waitForAuthReady();
    console.log('Router Guard - User:', user.value);

    if (to.meta.requiresAuth && !user.value) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (to.name === 'login' && user.value) {
        return { name: 'home' };
    }
});

export default router;