import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Return login directly after signup
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }

    async updateName(name) {
        try {
            return await this.account.updateName(name);
        } catch (error) {
            console.log("Appwrite service :: updateName :: error", error);
        }
    }

    async getPrefs() {
        try {
            return await this.account.getPrefs();
        } catch (error) {
            console.log("Appwrite service :: getPrefs :: error", error);
            return {};
        }
    }

    async updatePrefs(prefs) {
        try {
            return await this.account.updatePrefs(prefs);
        } catch (error) {
            console.log("Appwrite service :: updatePrefs :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
