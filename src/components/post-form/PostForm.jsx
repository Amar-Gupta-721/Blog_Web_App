import React, { useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
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
          userName : userData.name,
          userId: userData.$id
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
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
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
      <div className="w-full xl:w-2/3 lg:w-2/3 md:w-2/3 px-2 mb-3">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", {
            required: true
          })}
        />
        <Input
          label="Slug :"
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
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-full xl:w-1/3 lg:w-1/3 md:w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
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
        <Button children={`${post?"update":"submit"}`} type="submit" className={`w-full bg-blue-500 hover:bg-blue-900 active:bg-red-600 ${post ? "bg-green-500" : undefined}`} />
      </div>
    </form>
  );
}

export default PostForm;
