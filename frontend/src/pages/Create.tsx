import React, { useState } from "react";
import { NavBar } from "./Blogs";
import { CreateBlogData } from "@rohith_achar/medium";
import axios from "axios";
import { BACKEND_URL } from "./extras";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigation = useNavigate();
  const [postData, setPostData] = useState<CreateBlogData>({
    title: "",
    description: "",
  });

  const publishHandler = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title: postData.title, description: postData.description },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res.status == 200) navigation("/blogs");
      if (res.status == 401) {
        alert("Unauthorized user, please login again");
        navigation("/signin");
      }
    } catch (error) {
      alert("Unauthorized user, please login again");
      navigation("/signin");
    }
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="text-center px-20 mt-4">
        <input
          className="font-bold text-4xl text-center mb-4 mt-4 p-2 border-0 border-b-2 w-full"
          type="text"
          name=""
          id=""
          placeholder="Enter the title"
          onChange={(e) => {
            setPostData({
              ...postData,
              title: e.target.value.toLocaleUpperCase(),
            });
          }}
          value={postData.title}
        />
        <textarea
          className="p-2 w-full h-[65vh]"
          name=""
          id=""
          placeholder="Enter description"
          onChange={(e) => {
            setPostData({
              ...postData,
              description: e.target.value,
            });
          }}
          value={postData.description}
        ></textarea>
        <button
          className="btn btn-block btn-primary mt-4 mb-4"
          onClick={publishHandler}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Create;
