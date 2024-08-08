import { useEffect, useState } from "react";
import { NavBar, Post } from "./Blogs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "./extras";

const Blog = () => {
  const [blog, setBlog] = useState<Post>();
  const { id } = useParams();
  const navigation = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (res.status == 200) setBlog(res.data.blog);
      else navigation("/signup");
    } catch (error) {
      navigation("/signup");
    }
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="px-20 lg:px-40 lg:px-64 text-justify mt-4">
        <h1 className="font-bold text-4xl text-center mb-4">{blog?.title}</h1>
        {blog?.description}
      </div>
    </div>
  );
};

export default Blog;
