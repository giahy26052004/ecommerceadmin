import Layout from "@/components/layout";
import ProductForm from "@/components/productform";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EditProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState("");
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}

export default EditProductPage;
