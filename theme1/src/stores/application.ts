import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useAuth} from "@/stores/auth";

export const useApplication = defineStore('application', () => {
    const appData = ref({});
    const application = computed(() => appData.value);

    async function getApplication(id: string) {
        const auth = useAuth();
        if (!auth.isAuthenticated)
            return;

        const response = await fetch(`http://localhost:3000/user/applications/${id}`, {
            headers: {
                "X-Token": `${window.localStorage.getItem('token')}`
            }
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.json();
        if (!data || data.error) {
            return;
        }
        appData.value = data;
    }

    async function addRedirectUri(uri: string) {
        const auth = useAuth();
        if (!auth.isAuthenticated)
            return;

        if (!application.value)
            return;

        const response = await fetch(`http://localhost:3000/user/applications/${application.value.app_id}/redirect-uri`, {
            method: 'POST',
            headers: {
                "X-Token": `${window.localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.json();
        if (!data || data.error) {
            return;
        }
        console.log(data)
    }

    async function removeRedirectUri(uri: string) {
        const auth = useAuth();
        if (!auth.isAuthenticated)
            return;

        if (!application.value)
            return;

        const response = await fetch(`http://localhost:3000/user/applications/${application.value.app_id}/redirect-uri`, {
            method: 'DELETE',
            headers: {
                "X-Token": `${window.localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.json();
        if (!data || data.error) {
            return;
        }
        console.log(data)
    }

    async function resetSecret() {
        const auth = useAuth();
        if (!auth.isAuthenticated)
            return;

        if (!application.value)
            return;

        const response = await fetch(`http://localhost:3000/user/applications/${application.value.app_id}/reset-secret`, {
            method: 'POST',
            headers: {
                "X-Token": `${window.localStorage.getItem('token')}`
            }
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.json();
        if (!data || data.error) {
            return;
        }
        console.log(data);
        appData.value.app_secret = data.secret;
    }

    async function createApplication(name: string) {
        const auth = useAuth();
        if (!auth.isAuthenticated)
            return;

        const response = await fetch(`http://localhost:3000/user/applications`, {
            method: 'POST',
            headers: {
                "X-Token": `${window.localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name})
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.json();
        if (!data || data.error) {
            return;
        }
        return data;
    }

    return {
        application,
        getApplication,
        addRedirectUri,
        removeRedirectUri,
        resetSecret,
        createApplication
    }
})
