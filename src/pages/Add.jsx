import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Title from "../component/Title";
import Input, { Label } from "../component/ui/Input";
import { TiPlus } from "react-icons/ti";
import SmallLoader from "../component/smallLoader";
import toast from "react-hot-toast";
import { serverUrl } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    discountedPercentage: "",
    _type: "",
    category: "",
    offer: false,
    isAvailable: true,
    badge: false,
    tags: [],
    image1: null,
    image2: null,
    image3: null,
  });

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const { id, files } = e.target;
    setFormData({
      ...formData,
      [id]: files[0],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (value === "true" || value === "false") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleUploadProduct = async (e) => {
  e.preventDefault();
  const adminToken = localStorage.getItem("adminToken"); // ✅ get token from localStorage
  if (!adminToken) {
    toast.error("Admin not logged in!");
    return;
  }

  try {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });

    const response = await axios.post(serverUrl + "/api/product/add", data, {
      headers: {
        Authorization: `Bearer ${adminToken}`, // ✅ correct header
        "Content-Type": "multipart/form-data",
      },
    });

    const responseData = response.data;
    if (responseData.success) {
      toast.success(responseData.message);
      navigate("/list");
    } else {
      toast.error(responseData.message);
    }
  } catch (error) {
    console.log("Product data Uploading Error", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Upload failed!");
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleUploadProduct}
      className="flex flex-col items-start gap-3 w-full pb-10 "
    >
      <Title className="text-black">Upload image to Database</Title>
      <div className="flex flex-wrap items-center gap-5">
        {["image1", "image2", "image3"].map((imageId) => (
          <label htmlFor={imageId} key={imageId}>
            <div className="text-gray-500 border-2 border-dashed border-gray-400 px-4 py-2 hover:border-black/ duration-300 ease-in-out cursor-pointer rounded-md">
              {formData[imageId] ? (
                <img
                  src={URL.createObjectURL(formData[imageId])}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-md mb-2"
                />
              ) : (
                <FaCloudUploadAlt className="text-5xl" />
              )}

              <input
                type="file"
                hidden
                id={imageId}
                onChange={handleImageChange}
              />
              <p>{formData[imageId] ? "Change" : "Upload"}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label htmlFor="name">Product Name</Label>
        <Input
          text="text"
          placeholder="Type Product name here."
          value={formData.name}
          name="name"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label htmlFor="description">Product description</Label>
        <textarea
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border px-4 border-gray-500 rounded-md max-w-lg resize-none"
        />
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label htmlFor="brand">Product brand</Label>
        <Input
          type="text"
          placeholder="Type Product brand here."
          name="brand"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="price">Product price</Label>
          <Input
            type="number"
            placeholder="Type Product price here."
            name="price"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="discountedPercentage">
            Product discount percentage
          </Label>
          <Input
            type="number"
            placeholder="Product discount %."
            name="discountedPercentage"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="brand">Select brand</Label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="border px-4 border-gray-500 rounded-md max-w-[150px] "
          >
            <option value="">Select Type</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Special offer">Special offer</option>
            <option value="Promotions">Promotions</option>
          </select>
        </div>

        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="category">Select Category</Label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border px-4 border-gray-500 rounded-md max-w-[150px]"
          >
            <option value="">Select Category</option>
            <option value="men">Men</option>
            <option value="woman">Woman</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="offer">Offers</Label>
          <select
            name="offer"
            value={formData.offer}
            onChange={handleChange}
            className="border px-4 border-gray-500 rounded-md max-w-[150px] "
          >
            <option value={true}>true</option>
            <option value={false}>false</option>
          </select>
        </div>

        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="isAvailable">Availability</Label>
          <select
            name="isAvailable"
            value={formData.isAvailable}
            onChange={(e) =>
              setFormData({
                ...formData,
                isAvailable: e.target.value === "true",
              })
            }
            className="border px-4 border-gray-500 rounded-md max-w-[150px]"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        <div className="flex flex-col w-full gap-1">
          <Label htmlFor="badge">Badge</Label>
          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="border px-4 border-gray-500 rounded-md max-w-[150px] "
          >
            <option value={true}>true</option>
            <option value={false}>false</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <Label htmlFor="tags">Tags</Label>
        <div>
          {["Fashion", "Electronics", "Sports", "Accessories", "Others"].map(
            (tag) => (
              <div key={tag} className="flex items-center gap-2">
                <input
                  type="Checkbox"
                  id={tag.toLocaleLowerCase()}
                  name="tags"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  className="cursor-pointer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prevData) => ({
                        ...prevData,
                        tags: [...prevData.tags, tag],
                      }));
                    } else {
                      setFormData((prevData) => ({
                        ...prevData,
                        tags: prevData.tags.filter((t) => t !== tag),
                      }));
                    }
                  }}
                />
                <p>{tag}</p>
              </div>
            )
          )}
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="bg-black/70 h-10 w-20 justify-center cursor-pointer text-white uppercase font-semibold flex items-center rounded-md hover:bg-black duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add {loading ? <SmallLoader /> : <TiPlus className="text-lg mt-0.5" />}
      </button>
    </form>
  );
};

export default Add;
