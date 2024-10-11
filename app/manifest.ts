import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "校园汇生活条码",
    description: "获取校园汇生活取水条码",
    start_url: "/",
    display: "standalone",
  };
}
