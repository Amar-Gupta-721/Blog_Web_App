// import React, { useCallback, useEffect, useState} from 'react'
// import { useForm } from 'react-hook-form'
// import { Button, Input, Select, RTE } from '../index';
// import appwriteService from '../../appwrite/config';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// function PostForm({ post }) {
//   const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
//     defaultValues: {
//       title: post?.title || '',
//       slug: post?.$id || '',
//       content: post?.content || '',
//       status: post?.status || 'active'
//     }
//   });

//   const navigate = useNavigate();
//   const userData = useSelector(state => state.auth.userData);
//   const [featuredImagePreview, setFeaturedImagePreview] = useState('');

//   useEffect(() => {
//     if (post) {
//       setFeaturedImagePreview(appwriteService.getFilePreview(post.featuredImage));
//     }
//   }, [post]);


//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setFeaturedImagePreview(imageUrl);
//     }
//   };

//   const submit = async (data) => {
//     if (post) {
//       const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

//       if (file) {
//         await appwriteService.deleteFile(post.featuredImage);
//       }

//       const dbPost = await appwriteService.updatePost(
//         post.$id, {
//         ...data,
//         featuredImage: file ? file.$id : undefined
//       });

//       if (dbPost) {
//         navigate(`/post/${dbPost.$id}`);
//       }
//     } else {
//       const file = await appwriteService.uploadFile(data.image[0]);

//       if (file) {
//         const fileId = file.$id;
//         data.featuredImage = fileId;

//         const dbPost = await appwriteService.createPost({
//           ...data,
//           userName : userData.name,
//           userId: userData.$id
//         });

//         if (dbPost) {
//           navigate(`/post/${dbPost.$id}`);
//         }
//       }
//     }
//   };

//   const slugTransform = useCallback((value) => {
//     if (value && typeof value === 'string') {
//       return value
//         .trim()
//         .toLowerCase()
//         .replace(/[^\w\s-]/g, '') // Remove any non-word characters except spaces and hyphens
//         .replace(/\s+/g, '-') // Replace spaces with hyphens
//         .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
//         .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
//     }
//     return '';
//   }, []);

//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       if (name === 'title') {
//         setValue('slug', slugTransform(value.title), { shouldValidate: true });
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [watch, slugTransform, setValue]);

//   return (
//     <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
//       <div className="w-full xl:w-2/3 lg:w-2/3 md:w-2/3 px-2 mb-3">
//         <Input
//           label="Title :"
//           placeholder="Title"
//           className="mb-4"
//           {...register("title", {
//             required: true
//           })}
//         />
//         <Input
//           label="Slug :"
//           placeholder="Slug"
//           readOnly={post}
//           className="mb-4"
//           {...register("slug", {
//             required: true
//           })}
//           onInput={(e) => {
//             setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
//           }}
//         />
//         <RTE
//           label="Content :"
//           name="content"
//           control={control}
//           defaultValue={getValues("content")}
//         />
//       </div>
//       <div className="w-full xl:w-1/3 lg:w-1/3 md:w-1/3 px-2">
//         <Input
//           label="Featured Image :"
//           type="file"
//           className="mb-4"
//           accept="image/png, image/jpg, image/jpeg, image/gif"
//           {...register("image", { required: !post })}
//           onChange={handleImageChange}
//         />
//         {featuredImagePreview && (
//           <div className="w-full mb-4">
//           <img src={featuredImagePreview} alt={post?.title || 'Featured Image'} className="rounded-lg" />
//         </div>
//         )}
//         <Select
//           options={["active", "inactive"]}
//           label="Status"
//           className="mb-4"
//           {...register("status", { required: true })}
//         />
//         <Button children={`${post?"update":"submit"}`} type="submit" className={`w-full bg-blue-500 hover:bg-blue-900 active:bg-red-600 ${post ? "bg-green-500" : undefined}`} />
//       </div>
//     </form>
//   );
// }

// export default PostForm;

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.$id || '',
      content: post?.content || '',
      status: post?.status || 'active'
    }
  });

  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');

  useEffect(() => {
    if (post) {
      setFeaturedImagePreview(appwriteService.getFilePreview(post.featuredImage));
    }
  }, [post]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImagePreview(imageUrl);
    }
  };

  const submit = async (data) => {
    try {
      console.log('Form data before submission:', data); // Debug: Log form data
      alert('Form is submitting'); // Debug: Check if the form is being submitted
  
      let file = null;
      if (data.image && data.image.length > 0) {
        file = await appwriteService.uploadFile(data.image[0]);
        console.log('File uploaded:', file); // Debug: Log uploaded file details
      }
  
      if (post) {
        if (file && post.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
          console.log('Old file deleted:', post.featuredImage); // Debug: Log deleted file ID
        }
  
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });
  
        if (dbPost) {
          console.log('Post updated:', dbPost); // Debug: Log updated post details
          alert('Form submitted successfully');
          // navigate(`/post/${dbPost.$id}`);
        } else {
          throw new Error('Post update failed');
        }
      } else {
        if (file) {
          data.featuredImage = file.$id;
        } else {
          throw new Error('File upload failed');
        }
  
        const dbPost = await appwriteService.createPost({
          ...data,
          userName: userData.name,
          userId: userData.$id,
        });
  
        if (dbPost) {
          console.log('New post created:', dbPost); // Debug: Log created post details
          alert('Form submitted successfully');
          // navigate(`/post/${dbPost.$id}`);
        } else {
          throw new Error('Post creation failed');
        }
      }
    } catch (error) {
      console.error('Submit failed:', error); // Debug: Log error details
      alert('Form submission failed. Error: ' + error.message); // Debug: Show error message
    }
  };
  

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string') {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove any non-word characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
    }
    return '';
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form 
      onSubmit={handleSubmit(submit)} 
      className='flex flex-wrap'
    >
      <div className="w-full xl:w-2/3 lg:w-2/3 md:w-2/3 px-2 mb-3">
        <input
          placeholder="Title"
          className="mb-4"
          {...register("title", {
            required: true
          })}
        />
        {errors.title && <span className="text-red-500">Title is required</span>}
        
        <input
          placeholder="Slug"
          readOnly={post}
          className="mb-4"
          {...register("slug", {
            required: true
          })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        {errors.slug && <span className="text-red-500">Slug is required</span>}
        
        {/* Temporarily replace RTE with a simple textarea */}
        <textarea
          placeholder="Content"
          {...register("content", {
            required: true
          })}
        />
        {errors.content && <span className="text-red-500">Content is required</span>}
      </div>
      <div className="w-full xl:w-1/3 lg:w-1/3 md:w-1/3 px-2">
        <input
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
          onChange={handleImageChange}
        />
        {errors.image && <span className="text-red-500">Image is required</span>}
        {featuredImagePreview && (
          <div className="w-full mb-4">
            <img src={featuredImagePreview} alt={post?.title || 'Featured Image'} className="rounded-lg" />
          </div>
        )}
        <select {...register("status", { required: true })} className="mb-4">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <span className="text-red-500">Status is required</span>}
        <button type="submit" className={`w-full bg-blue-500 hover:bg-blue-900 active:bg-red-600 ${post ? "bg-green-500" : undefined}`}>
          {post ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
