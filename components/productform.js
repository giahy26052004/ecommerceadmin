import Layout from "./layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./spinners";
import { ReactSortable } from "react-sortablejs";
function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: ecommerceImages,
  category: existCategory,
  properties: existProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [images, setImages] = useState(ecommerceImages || []);
  const router = useRouter();
  const [gotoProducts, setgotoProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState(existCategory || "");
  const [categories, setCategories] = useState([]);
  const [productProperties, setProductProperties] = useState(
    existProperties || {}
  );
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);
  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
      setgotoProducts(true);
    } else {
      // create
      axios.post("/api/products", data);
      setgotoProducts(true);
    }
  }
  if (gotoProducts) router.push("/products");
  async function uploadImage(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((preImage) => {
        return [...preImage, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function uploadImageOrder(images) {
    setImages(images);
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let cateInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...cateInfo.properties);
    while (cateInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === cateInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      cateInfo = parentCat;
    }
  }
  function changeProductProp(propname, value) {
    setProductProperties((pre) => {
      return { ...pre, [propname]: value };
    });
  }
  return (
    <form onSubmit={saveProduct}>
      <label>ProductName</label>
      <input
        type="text"
        onChange={(ev) => setTitle(ev.target.value)}
        placeholder="productName"
        value={title}
      />
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value={""}>Uncategoried</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div key={index} className="flex gap-1">
            <div>{p.name[0].toUpperCase() + p.name.substring(1)}</div>
            <select
              value={productProperties[p.name]}
              onChange={(e) => changeProductProp(p.name, e.target.value)}
            >
              {p.values.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}

      <label>Photo</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={uploadImageOrder}
          className="flex flex-wrap gap-1"
        >
          {images?.length &&
            images.map((image) => {
              return (
                <div
                  className="inline-block h-24 bg-gray-50 border-gray-100 p-4 shadow-md rounded-sm"
                  key={image}
                >
                  <img src={image} className="rounded-lg" />
                </div>
              );
            })}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 border text-center text-black flex items-center justify-center flex-col text-sm gap-1 rounded-lg bg-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add Image</div>
          <input type="file" className="hidden" onChange={uploadImage} />
        </label>
        {!images?.length && <div>no photos in this oroducts</div>}
      </div>
      <label>Decription</label>
      <textarea
        placeholder="decription"
        onChange={(ev) => setDescription(ev.target.value)}
        value={description}
      ></textarea>
      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        onChange={(ev) => setPrice(ev.target.value)}
        value={price}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

export default ProductForm;
