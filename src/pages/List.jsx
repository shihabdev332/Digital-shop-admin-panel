import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";
import Title from "../component/Title";
import Loader from "../component/Loader";
import { Link } from "react-router-dom";
import Price from "../component/Price";
import { FaRegTrashAlt } from "react-icons/fa";

const List = ({ token }) => {
  const [list, setList] = useState([
    { _id: "", name: "", price: 0, images: [] },
  ]);

  const handleRemoveProduct = async (item) => {
    const confirmRemoval = window.confirm(`Do you want to remove${item.name}`);
    if (confirmRemoval) {
      try {
        setLoading(true);
        const response = await axios.post(
          serverUrl + "/api/product/remove",
          {
            _id: item?._id,
          },
          {
            headers: { token },
          }
        );
        const data = response?.data;
        if (data?.success) {
          toast.success(data?.message);
          await fetchProductList();
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.log("Product removed SuccessFull!", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const [loading, setLoading] = useState(false);
  const fetchProductList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(serverUrl + "/api/product/list");
      const data = response?.data;
      if (data?.success) {
        setList(data?.product);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Product List fetching error", error);
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center justify-between ">
            <Title> Product List</Title>
            <Link
              to={"/add"}
              className="text-sm font-medium hover:text-blue-600 duration-300 cursor-pointer "
            >
              Add Product +
            </Link>
          </div>
          {list?.length > 0 ? (
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-300 text-sm mt-1.5">
                <b className=" ">Images</b>
                <b>Name</b>
                <b className="hidden md:inline-block ">Category</b>
                <b>Price</b>
                <b className="hidden md:inline-block ">Action</b>
                <b className="hidden md:inline-block ">Edit</b>
              </div>
              {list?.map((item) => (
                <div
                  key={item?._id}
                  className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-300 text-sm mt-1.5"
                >
                  <img
                    src={item?.images[0]}
                    alt="images"
                    className="w-16 bg-white rounded-sm"
                  />
                  <p className="font-medium line-clamp-1 items-center">
                    {" "}
                    {item?.name}
                  </p>
                  <p className="hidden md:inline-block font-medium items-center ">
                    {item?.category}
                  </p>
                  <p>
                    <Price amount={item.price} />
                  </p>
                  <div className=" justify-center items-center hidden md:inline-block">
                    <FaRegTrashAlt
                      onClick={() => handleRemoveProduct(item)}
                      className="text-lg cursor-pointer hover:text-red-500 duration-300 ease-in-out "
                    />
                  </div>
                  <Link
                    to={"/add"}
                    className="hidden md:inline-block font-semibold hover:text-green-600 duration-300 ease-in-out "
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2">
              <p className="mb-4 text-red-600 font-medium tracking-wide">
                You have no Product here
              </p>
              <Link>Add Products+</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default List;
