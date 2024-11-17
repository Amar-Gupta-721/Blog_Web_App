import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ID } from 'appwrite';

function PostForm({ post }) {
  const { register, handleSubmit, control, getValues } = useForm({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFeaturedImagePreview(appwriteService.getFilePreview(post.featuredImage));
    }
  }, [post]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPG, JPEG, GIF).");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImagePreview(imageUrl);
    }
  };

  const submit = async (data) => {
    setIsSubmitting(true); 

    if (!post && (!data.image || data.image.length === 0)) {
      alert("Please upload a featured image.");
      setIsSubmitting(false); 
      return;
    }

    try {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(
          post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          const dbPost = await appwriteService.createPost({
            ...data,
            userName: userData.name,
            userId: userData.$id,
            slug : ID.unique()
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap backdrop-blur-3xl'>
      <div className="w-full xl:w-2/3 lg:w-2/3 md:w-2/3 px-2 mb-3 text-white ">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", {
            required: true
          })}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-full xl:w-1/3 lg:w-1/3 md:w-1/3 px-2 text-white">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
          onChange={handleImageChange}
        />
        {featuredImagePreview && (
          <div className="w-full mb-4">
          <img src={featuredImagePreview} alt={post?.title || 'Featured Image'} className="rounded-lg" />
        </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
         <Button
          type="submit"
          className={`w-full  ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-900 active:bg-red-600'} ${post ? "bg-green-500" : undefined}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : post ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;