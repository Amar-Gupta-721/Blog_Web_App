// import React, {useState, useEffect} from 'react'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import appwriteService from '../appwrite/config'
// import {Button, Container} from '../components'
// import parse from "html-react-parser"
// import { useSelector } from 'react-redux'

// export default function Post() {
//     const [post, setPost] = useState(null)
//     const {slug} = useParams()
//     const navigate = useNavigate()

//     const userData = useSelector((state)=>state.auth.userData)
    
//     const isAuthor = post && userData ? post.userId === userData.$id : false;

//     useEffect(()=>{
//         if(slug){
//             appwriteService.getPost(slug).then((post)=>{
//                 if(post) setPost(post);
//                 else navigate("/");
//             })
//         } else navigate("/");
//     },[slug, navigate]);

//     const deletePost = ()=>{
//         appwriteService.deletePost(post.$id).then((status)=>{
//             if(status){
//                 appwriteService.deleteFile(post.featuredImage);
//                 navigate("/all-posts");
//             }
//         })
//     }

//     return post ? (
//         <div className="py-8 min-w-fit mx-4 backdrop-blur-3xl">
//             <Container className='p-4 border-2 border-gray-700 shadow-xl rounded-xl'>
//                 <div className="flex gap-20 text-3xl m-3 md:pb-4 ml-0 xl:ml-3 lg:ml-3 md:ml-3">
//                     <div className='grow'>
//                         <h2 className='text-lg xl:text-2xl lg:text-2xl md:text-2xl'>By : <span className='font-bold text-xl xl:text-3xl lg:text-3xl md:text-3xl text-green-600'>{post?.userName || "User"}</span></h2>
//                         <h1 className='font-bold text-3xl xl:text-5xl lg:text-5xl md:text-5xl capitalize md:py-5 sm:py-3'>{post.title}</h1>
//                     </div>

//                     <div className='relative'>
//                     {isAuthor && (
//                         <div className='absolute right-0 -top-4 xl:top-0 lg:top-0 md:top-0'>
//                             <Link to={`/edit-post/${post.$id}`}>
                                
//                                 <Button 
//                                 bgColor = "backdrop-blur-3xl"
//                                 className="md:mb-2 sm:mb-1 text-sm xl:text-lg lg:text-lg md:text-lg hover:bg-neutral-800 active:text-black active:bg-white active:border-2 border-neutral-800"
//                                 >
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button
//                             bgColor="backdrop-blur-3xl"
//                             className='text-sm xl:text-lg lg:text-lg md:text-lg hover:bg-neutral-800 active:text-black active:bg-white active:border-2 border-neutral-800'
//                             onClick = {deletePost}
//                             >
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 </div>

//                 <div className="w-full mb-3 relative">
//                     <img 
//                         src={appwriteService.getFilePreview(post.featuredImage)} 
//                         alt={post.title} 
//                         className="rounded-xl max-h-svh max-w-full"
//                     /> 
//                 </div>
                
//                 <div className="browser-css text-xl leading-8 text-neutral-300">
//                     {parse(post.content)}</div>
//             </Container>
//         </div>
//     ) : null;
// }


import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Button, Container } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate('/');
      });
    } else navigate('/');
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate('/all-posts');
      }
    });
  };

  return post ? (
    <div className="py-12 px-4 md:px-8 bg-transparent min-h-screen text-white">
      <Container className="bg-transparent shadow-lg rounded-3xl p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-gray-300 text-lg md:text-xl mb-1">
              By: <span className="text-green-400 font-semibold">{post?.userName || 'User'}</span>
            </h2>
            <h1 className="text-3xl md:text-5xl font-bold text-white capitalize">
              {post.title}
            </h1>
          </div>

          {isAuthor && (
            <div className="flex gap-3">
              <Link to={`/edit-post/${post.$id}`}>
                <Button
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition"
                >
                  <Pencil size={18} />
                  Edit
                </Button>
              </Link>
              <Button
                onClick={deletePost}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition"
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="w-full overflow-hidden rounded-2xl mb-10">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full object-cover max-h-[600px] rounded-2xl"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-100 leading-relaxed">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : null;
}
