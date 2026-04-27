import { SalesPagePreview } from "@/components/preview/SalesPagePreview";
import { DownloadHTMLButton } from "@/components/DownloadHTMLButton";

type Props = {
  searchParams: Promise<{
    data: string;
    productName: string;
    template: string;
  }>;
};

export default async function ExportPage({ searchParams }: Props) {
  const params = await searchParams;

  const data = JSON.parse(decodeURIComponent(params.data));
  const productName = params.productName;

  return (
    <>
      <SalesPagePreview
        data={data}
        productName={productName}
        template={params.template}
      />

      <DownloadHTMLButton productName={productName} />
    </>
  );
}
