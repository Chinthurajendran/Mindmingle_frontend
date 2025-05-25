import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../Interceptors/UserInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EditBloge() {
  const [blog, setBlog] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const BlogeID = location.state?.BlogeID;
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(
          `fetch_blog_details_for_editing/${BlogeID}`
        );
        if (response.status === 200) {
          const fetchedBlog = response.data.bloges[0]; 
          setBlog(fetchedBlog);

          setFormData({
            description: fetchedBlog.description || "",
            image: null,
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
      }
    };

    if (BlogeID) {
      fetchBlog();
    }
  }, [BlogeID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const updateBloge = async () => {
    if (!blog) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axiosInstance.put(
        `Bloge_updation/${blog.blog_uid}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/UserProfilePage/UserBlogs")
      }
    } catch (error) {
      console.error(
        "Update blog error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.detail || "Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blog data...</p>
      </div>
    );
  }
  console.log(formData)
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Edit Blog Post
        </h1>

        <section className="bg-white shadow-md rounded-lg p-8 mb-12 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Blog Post</h2>

          <div className="flex flex-col items-center gap-4 mb-6">
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Blog Preview"
                className="max-w-full max-h-96 object-contain rounded-md border border-gray-300"
              />
            ) : blog.photo ? (
              <img
                src={blog.photo}
                alt="Blog Preview"
                className="max-w-full max-h-96 object-contain rounded-md border border-gray-300"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />
            ) : (
              <p>No image available</p>
            )}

            <label className="cursor-pointer bg-gray-300 px-4 py-2 rounded-md text-sm text-center">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Edit blog description"
            className="block w-full rounded-md border border-gray-300 p-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-8 resize-none"
          />

          <button
            onClick={updateBloge}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default EditBloge;
