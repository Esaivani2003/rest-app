import ProductPage from "@/components/MenuPage";
import Layout from "@/components/layout";
import PopupFilter from "@/components/popupfilter/popup-filter"

export default function Product() {
  return (
    <Layout>
    <div>
      <div className="flex pt-5 px-8 justify-between items-center">
              <h1 className="text-2xl font-bold">Menu</h1>
              {/* <PopupFilter /> */}
            </div>
      <ProductPage />
    </div>
    </Layout>
  );
}
