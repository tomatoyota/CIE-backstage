export default {
    getUsername() {
        const username = localStorage.getItem('cieebo-admin-user');

        if (username) {
            return JSON.parse(username).backendUserAccount
        }
    },
    getUserLastTimeLogin() {
        const username = localStorage.getItem('cieebo-admin-user');

        if (username) {
            return JSON.parse(username).lastTimeLogin
        }
    }
}