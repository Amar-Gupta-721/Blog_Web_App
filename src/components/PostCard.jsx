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
  }, []);
  return (
    <>
      <div className="my-4 mx-2 backdrop-blur-3xl lg:m-8 md:m-4 sm:m-2 px-30 hover:shadow-md duration-200 ease-in-out hover:scale-105">
        <div className="flex shadow-xl overflow-auto rounded-xl max-h-48 lg:max-h-64 lg:min-h-56 ">
          <div className="w-2/5 mr-2">
            <img
              className="w-full h-full max-w-48 max-h-48 lg:max-h-80 lg:max-w-96 md:max-w-80 sm:max-w-52 sm:max-h-52 rounded-l-xl"
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
            />
          </div>
          <div className="w-3/5 text-left xl:px-4 lg:px-4 md:px-2 py-1 xl:py-3 lg:py-3 md:py-3 bg-inherit">
            <div className="flex items-center text-neutral-50 text-sm lg:text-xl md:text-lg sm:text-sm">
              <AccessTimeIcon
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "20px",
                    md: "24px",
                    lg: "28px",
                    xl: "28px",
                  },
                  marginRight: "0.25rem",
                }}
              />
              <span>{date}</span>
            </div>
            <Link to={`/post/${post.$id}`}>
              <h2 className="py-2 font-semibold text-neutral-50 capitalize truncate text-md lg:text-4xl md:text-3xl sm:text-2xl">
                {post.title}
              </h2>
            </Link>
            <h4 className="text-neutral-50 text-sm lg:text-xl md:text-lg sm:text-sm">
              By : {post?.userName || "User"}
            </h4>{" "}
            {/*change (post?.userName || "user") by post.userName */}
            <Link to={`/post/${post.$id}`}>
              <Button
                children={"Read More"}
                className="!text-neutral-950 bg-white text-xs md:text-sm lg:text-base xl:text-lg mt-2 xl:mt-3 lg:mt-3 md:mt-3 hover:bg-neutral-300 hover:text-black transition-all duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
