import conf from '../conf/conf.js'
import {Client,Databases, Storage, ID, Query} from 'appwrite'

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title,slug,content,featuredImage,status,userId,userName}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatebaseId,
                conf.appwriteCollectionId,
                slug,     
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    userName
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error ",error);
        }
    }

    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatebaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error ",error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatebaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error ",error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatebaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error ",error);
            return null;
        }
    }

    async getPosts(){ 
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatebaseId,
                conf.appwriteCollectionId,
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error ",error);
            return null;
        }
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error ",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error ",error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }
}
const service = new Service()
export default service
