// src/appwrite/auth.js

import conf from '../conf/conf.js';
import { Client, Account } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    /**
     * This is the ONLY login method you need.
     * It takes a token from Clerk to create an Appwrite session.
     */
    async loginWithClerkJwt(jwt) {
        try {
            return await this.account.createJWT(jwt);
        } catch (error) {
            console.error("Appwrite login with JWT failed:", error);
            return null;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            return null; // It's normal for this to fail if there's no session
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite logout failed:", error);
        }
    }
}

const authService = new AuthService();

export default authService;