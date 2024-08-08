import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blogs from "./pages/Blogs";
import Blog from "./pages/Blog";
import Create from "./pages/Create";
import { useEffect } from "react";
import { BACKEND_URL } from "./pages/extras";
import axios from "axios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Decider />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

const Decider = () => {
  const navigation = useNavigate();
  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/blog/$1`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (res.status == 200) navigation("/blogs");
    } catch (error) {
      navigation("/signup");
    }
  };
  return <></>;
};

export default App;
