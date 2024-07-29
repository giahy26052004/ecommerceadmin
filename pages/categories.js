import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchGetCategory();
  }, []);
  const fetchGetCategory = () => {
    axios.get("/api/categories").then((response) => {
      setCategory(response.data);
    });
  };
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((prop) => ({
        name: prop.name,
        values: prop.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory("");
      setName("");
      setParentCategory("");
      setProperties([]);
      fetchGetCategory();
    } else {
      await axios.post("/api/categories", data);
      setName("");
      setParentCategory("");
      setProperties([]);
      fetchGetCategory();
    }
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties((pre) => {
      const properties = [...pre];
      pre[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((pre) => {
      const properties = [...pre];
      pre[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexRemoved) {
    setProperties((pre) => {
      const newProperties = [...pre];
      return newProperties.filter((p, pindex) => {
        return indexRemoved !== pindex;
      });
    });
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Example",
        text: `Are you sure you want to delete ${category.name}`,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
        didOpen: () => {
          // run when swal is opened...
        },
        didClose: () => {
          // run when swal is closed...
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/categories?_id=" + category._id).then(() => {
            fetchGetCategory();
          });
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }
  function addProperty() {
    setProperties((pre) => {
      return [...pre, { name: "", values: "" }];
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New category name"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Categories Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <select onChange={(e) => setParentCategory(e.target.value)}>
            <option value={""}>No parent Category</option>
            {category.length > 0 &&
              category.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm"
          >
            Add new properties
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" key={index}>
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                  placeholder="Properties Name (example color)"
                />
                <input
                  value={property.values}
                  type="text"
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  placeholder="values coma separated"
                />
                <button
                  className="btn-default"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory("");
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent name</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {category.length > 0 &&
              category.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                <div className="flex">
                      <button
                        onClick={() => editCategory(category)}
                        className="flex btn-default mr-1"
                      >
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="flex btn-red"
                      >
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        Delete
                      </button>
                </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
