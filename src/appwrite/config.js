import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createTransaction({ text, amount, type, category, date, userid }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    text,
                    amount,
                    type,
                    category,
                    date,
                    userid
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createTransaction :: error", error);
        }
    }

    async getTransactions(userid) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("userid", userid)
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getTransactions :: error", error);
            return false;
        }
    }

    async deleteTransaction(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteTransaction :: error", error);
            return false;
        }
    }

    async updateTransaction(documentId, { text, amount, type, category, date }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    text,
                    amount,
                    type,
                    category,
                    date
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateTransaction :: error", error);
        }
    }

    subscribe(callback) {
        return this.client.subscribe(
            `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`,
            (response) => {
                callback(response);
            }
        );
    }

    // Optional: for adding category icons or receipts later
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service;
