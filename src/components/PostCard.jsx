import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import Button from "./Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function PostCard({ post }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    const dateStr = post.$createdAt;
    const date = new Date(dateStr);

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "long",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    setDate(formattedDate);
  }, [post.$createdAt]);

  return (
    <div
      className="group bg-white/10 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden 
                    w-full max-w-[400px] h-[400px] flex flex-col"
    >
      <div className="h-[50%] w-full overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={appwriteService.getFilePreview(post.featuredImage)}
          alt={post.title}
        />
      </div>

      <div className="h-[50%] w-full flex flex-col justify-between p-4">
        <div className="flex items-center text-neutral-200 text-xs md:text-sm">
          <AccessTimeIcon className="mr-2" fontSize="small" />
          <span>{date}</span>
        </div>

        <Link to={`/post/${post.$id}`}>
          <h2 className="text-white font-semibold text-lg md:text-xl hover:text-blue-400 transition-colors duration-300 truncate capitalize mt-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-neutral-300 text-xs md:text-sm mt-2">
          By: <span className="font-medium">{post.userName}</span>
        </p>

        <div className="mt-3">
          <Link to={`/post/${post.$id}`}>
            <Button
              children={"Read More"}
              className="!text-black bg-white rounded-full px-5 py-2 text-xs md:text-sm hover:bg-neutral-300 hover:text-black transition-all duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
