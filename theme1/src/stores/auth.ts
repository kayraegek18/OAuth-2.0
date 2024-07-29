import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = computed(() => user.value !== null);

    async function setUser() {
        const token = window.localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await fetch("http://localhost:3000/user", {
            headers: {
                "X-Token": `${token}`
            }
        });
        if (response.status !== 200) {
            return window.localStorage.removeItem('token');
        }
        const data = await response.json();
        if (!data || data.error) {
            return window.localStorage.removeItem('token');
        }
        user.value = data;
    }

    return {
        user,
        isAuthenticated,
        setUser
    }
})
