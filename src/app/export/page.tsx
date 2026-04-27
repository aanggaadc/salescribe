import { SalesPagePreview } from "@/components/preview/SalesPagePreview";
import { DownloadHTMLButton } from "@/components/DownloadHTMLButton";

type Props = {
  searchParams: {
    data: string;
    productName: string;
    template: string;
  };
};

export default function ExportPage({ searchParams }: Props) {
  const data = JSON.parse(decodeURIComponent(searchParams.data));
  const productName = searchParams.productName;

  return (
    <>
      <SalesPagePreview
        data={data}
        productName={productName}
        template={searchParams.template}
      />

      <DownloadHTMLButton productName={productName} />
    </>
  );
}
