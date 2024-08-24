import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

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
                await this.login({ email, password });
                await this.sendVerificationEmail();
                return userAccount;
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error ", error);
            throw error;
        }
    }

    async sendVerificationEmail() {
        try {
            return await this.account.createVerification("https://blogapp-mu-puce.vercel.app/verify-email");
            // return await this.account.createVerification("http://localhost:5173/verify-email");
        } catch (error) {
            console.log("Appwrite service :: sendVerificationEmail :: error ", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error ", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error ", error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error ", error);
            throw error;
        }
    }

    async verifyEmail(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.log("Appwrite service :: verifyEmail :: error ", error);
            throw error;
        }
    }

    async resetPassword(userId, secret, newPassword) {
        try {
            await this.account.updateRecovery(userId, secret, newPassword);
        } catch (error) {
            console.log("Appwrite service :: resetPassword :: error ", error);
            throw error;
        }
    }

    async sendPasswordRecovery(email) {
        try {
            await this.account.createRecovery(email, 'https://blogapp-mu-puce.vercel.app/reset-password');
        } catch (error) {
            console.log("Appwrite service :: sendPasswordRecovery :: error ", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
