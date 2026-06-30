const TOKEN_KEY = "agentfolio_token";
const USER_KEY = "agentfolio_user";

export function saveAuth(token: string, user: object) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): any {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
    return !!getToken();
}