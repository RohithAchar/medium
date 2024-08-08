import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "./extras";
import { Link, useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Post[]>();
  const navigation = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/blog`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (res.status == 200) setBlogs(res.data.blogs);
      else navigation("/signup");
    } catch (error) {
      console.log("error");
      navigation("/signup");
    }
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="px-20 my-8">
        {blogs?.map((blog) => {
          return (
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <Card
                key={blog.id}
                blog={{
                  title: blog.title,
                  description: blog.description,
                  name: blog.author.name,
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const NavBar = () => {
  const navigation = useNavigate();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a
          className="btn btn-ghost text-xl"
          onClick={() => {
            navigation("/blogs");
          }}
        >
          Medium
        </a>
      </div>
      <div className="flex-none gap-2">
        <button
          className="btn"
          onClick={() => {
            navigation("/create");
          }}
        >
          Create blog
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full border border-slate-500">
              {/* <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              /> */}
              <div className="mt-3">You</div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a
                onClick={() => {
                  localStorage.clear();
                  navigation("/signup");
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Card = ({ blog }: CardProps) => {
  return (
    <div className="card bg-base-100 w-full mt-3 shadow-xl cursor-pointer">
      <div className="card-body">
        <h2 className="card-title">{blog.title}</h2>
        <p>{blog.description.slice(0, 200) + "..."}</p>
        <p className="text-slate-400">{blog.name ? blog.name : "Anonymous"}</p>
      </div>
    </div>
  );
};

type CardProps = {
  blog: Blog;
};

type Blog = {
  title: string;
  description: string;
  name?: string;
};

type Author = {
  name: string;
};

export type Post = {
  id: number;
  title: string;
  description: string;
  authorId: number;
  author: Author;
};

export default Blogs;
