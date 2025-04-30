import conf from '../../conf/conf.js';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ID } from 'appwrite';

function PostForm({ post }) {
  const { register, handleSubmit, control, setValue, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      status: post?.status || 'active',
      image: null,
    }
  });

  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const GEMINI_API_KEY = conf.geminiApiKey; // Your Gemini API key

  useEffect(() => {
    if (post) {
      setFeaturedImagePreview(appwriteService.getFilePreview(post.featuredImage));
    }
  }, [post]);

  const handleImageChange = (file) => {
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

  const generateContent = async () => {
    const title = getValues("title");
    if (!title) {
      alert("Please enter a title first.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Write a detailed blog post about "${title}"` }]
            }
          ]
        }),
      });

      const data = await response.json();
      let generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        const lines = generatedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let formattedContent = "";
        let inList = false;

        for (let line of lines) {
          if (line.startsWith('## ')) {
            formattedContent += `<h2>${line.substring(3)}</h2>`;
          } else if (line.startsWith('# ')) {
            formattedContent += `<h1>${line.substring(2)}</h1>`;
          } else if (line.startsWith('* ')) {
            if (!inList) {
              formattedContent += "<ul>";
              inList = true;
            }
            formattedContent += `<li>${line.substring(2)}</li>`;
          } else {
            if (inList) {
              formattedContent += "</ul>";
              inList = false;
            }
            formattedContent += `<p>${line}</p>`;
          }
        }

        if (inList) {
          formattedContent += "</ul>";
        }

        formattedContent = formattedContent
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>")
          .replace(/`(.*?)`/g, "<code>$1</code>");

        setValue("content", formattedContent);
      } else {
        alert("Failed to generate content. Try again.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Error generating content. Check your API key or quota.");
    } finally {
      setIsGenerating(false);
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
        const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;
        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const updatedPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined
        });

        if (updatedPost) {
          navigate(`/post/${updatedPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          const newPost = await appwriteService.createPost({
            ...data,
            slug: ID.unique(),
            userName: userData.name,
            userId: userData.$id,
          });

          if (newPost) {
            navigate(`/post/${newPost.$id}`);
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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap backdrop-blur-3xl mt-6">
      <div className="w-full xl:w-2/3 lg:w-2/3 md:w-2/3 px-2 mb-3 text-white">
        <Input
          label="Title:"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <div className="flex justify-end mb-2">
          <Button
            type="button"
            onClick={generateContent}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Content with AI"}
          </Button>
        </div>

        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-full xl:w-1/3 lg:w-1/3 md:w-1/3 px-2 text-white">
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange } }) => (
            <Input
              label="Featured Image:"
              type="file"
              className="mb-4"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              onChange={(e) => {
                const file = e.target.files[0];
                handleImageChange(file);
                onChange(e.target.files);
              }}
            />
          )}
        />
        {featuredImagePreview && (
          <div className="w-full mb-4">
            <img src={featuredImagePreview} alt={post?.title || 'Featured Image'} className="rounded-lg" />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status:"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          className={`w-full font-bold py-2 px-4 rounded 
            ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 
              post ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'}
          `}
          disabled={isSubmitting || isGenerating}
        >
          {isSubmitting ? 'Submitting...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
