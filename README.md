
# **Blog_Web_App**

### **Overview**
The **Blog Web App** is a full-stack blogging platform where users can create, view, update, and delete (CRUD) blog posts. It features user authentication, email verification, and password recovery to ensure security. The app is fully responsive and works across all screen sizes.  

---

## **Demo**
- **Live Demo:** https://blogapp-mu-puce.vercel.app 

---

## **Technologies Used**
- **Frontend**: ReactJS, Tailwind CSS, Material-UI (MUI)  
- **Backend**: Appwrite (authentication, email verification, forgot password, database )  
- **Deployment**: Vercel  
- **Version Control**: GitHub  


## **Features**
- **Authentication**: User login, signup, and logout functionality powered by Appwrite.  
- **Email Verification**: Verifies user email upon registration.  
- **Password Recovery**: Forgot password and reset functionality.  
- **CRUD Operations**: Users can create, read, update, and delete their blog posts.  
- **Responsive Design**: Works seamlessly across devices of all sizes.
---

## **Installation**
To run the project locally, follow these steps:

### **Steps:**
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Amar-Gupta-721/Blog_Web_App.git
   cd Blog_Web_App
    ```
2. **Install Dependencies:**    
     ```bash
     npm install

3. **Configure Appwrite:**

- Install and set up an Appwrite server or use Appwrite Cloud.
- Create a new project in Appwrite.
- Configure collections and authentication in the Appwrite dashboard.
- Generate your API keys and project ID from the Appwrite console.

4. **Create a .env file and add the following environment variables:** 
Create a ```.env``` file in the backend directory and add the following:

```bash 
VITE_APPWRITE_URL = <your-appwrite-endpoint>
VITE_APPWRITE_PROJECT_ID = <your-appwrite-projectId>
VITE_APPWRITE_DATABASE_ID =<your-appwrite-databaseId>
VITE_APPWRITE_COLLECTION_ID = <your-appwrite-collectionId>
VITE_APPWRITE_BUCKET_ID = <your-appwrite-bucketId>
VITE_RTE_API_KEY = <your-rte-apiKey>
```
5. **Run the Application:** Start the development server:
```bash 
npm run dev
```
6. **Visit the app at** http://localhost:5173.
   
