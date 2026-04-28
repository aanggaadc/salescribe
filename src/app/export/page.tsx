import LZString from "lz-string";

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

  if (!params.data || !params.productName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">
            Invalid Parameters
          </h1>
          <p className="text-obsidian-300 mt-2">
            No data found. Please generate a sales page first.
          </p>
        </div>
      </div>
    );
  }

  let data;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(
      params.data,
    );

    if (!decompressed) throw new Error("Failed to decompress");

    data = JSON.parse(decompressed);
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">
            Invalid Data Format
          </h1>
          <p className="text-obsidian-300 mt-2">
            The data could not be decoded. Please try again.
          </p>
        </div>
      </div>
    );
  }

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
