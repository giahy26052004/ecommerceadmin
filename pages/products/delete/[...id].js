import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState("");
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios
      .get("/api/products?id=" + id)
      .then((response) => setProductInfo(response.data));
  }, [id]);
  const goBack = () => {
    router.push("/products");
  };
  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id).then(() => {
      goBack();
    });
  }
  return (
    <Layout>
      <h1 className="text-center">
        {" "}
        Do you want to delete {productInfo?.title}?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
}

export default DeleteProductPage;
