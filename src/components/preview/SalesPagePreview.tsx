import { SalesPageOutput } from "@/types";

interface Props {
  data: SalesPageOutput;
  productName: string;
  template?: string;
}

export function SalesPagePreview({
  data,
  productName,
  template = "modern",
}: Props) {
  if (template === "bold")
    return <BoldTemplate data={data} productName={productName} />;
  if (template === "minimal")
    return <MinimalTemplate data={data} productName={productName} />;
  return <ModernTemplate data={data} productName={productName} />;
}

function ModernTemplate({
  data,
  productName,
}: {
  data: SalesPageOutput;
  productName: string;
}) {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm font-medium mb-6">
            {productName}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            {data.headline}
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {data.subheadline}
          </p>
          <button className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5">
            {data.cta}
          </button>
        </div>
      </section>

      {/* Pain Points */}
      {data.painPoints && data.painPoints.length > 0 && (
        <section className="bg-slate-50 px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">
              Sound familiar?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.painPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                >
                  <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                  <p className="text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-slate-600 leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-purple-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What you&apos;ll get
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {data?.benefits?.map((b, i) => (
              <div
                key={i}
                className="flex gap-3 bg-white rounded-xl p-5 shadow-sm border border-purple-100"
              >
                <span className="text-purple-500 font-bold text-lg flex-shrink-0">
                  ✓
                </span>
                <p className="text-slate-700">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {data?.features?.map((f, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl p-5 border border-slate-100"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold mb-3">
                  {i + 1}
                </div>
                <p className="text-slate-700 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-900 text-white px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">❝</div>
          <p className="text-xl text-slate-300 italic leading-relaxed">
            {data.socialProof}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pricing</h2>
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 text-white rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-semibold mb-6">{data.pricing}</p>
            {data.guarantee && (
              <p className="text-slate-300 text-sm mb-8">🛡️ {data.guarantee}</p>
            )}
            <button className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-12 py-4 rounded-full text-lg transition-all shadow-lg">
              {data.cta}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BoldTemplate({
  data,
  productName,
}: {
  data: SalesPageOutput;
  productName: string;
}) {
  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* Hero */}
      <section className="px-6 py-24 border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto">
          <div className="text-yellow-400 font-mono text-xs md:text-sm uppercase tracking-widest mb-4">
            ⚡ {productName}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-black leading-none mb-6 uppercase tracking-tight">
            {data.headline}
          </h1>
          <p className="text-md md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed border-l-4 border-yellow-400 pl-4">
            {data.subheadline}
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-10 py-5 text-sm md:text-xl uppercase tracking-wide transition-all hover:-translate-y-1">
            {data.cta} →
          </button>
        </div>
      </section>

      {/* Description */}
      <section className="px-6 py-12 bg-yellow-400 text-black">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-2xl font-bold leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg md:text-2xl lg:text-4xl font-black uppercase mb-10 border-b-4 border-yellow-400 pb-4">
            What you get:
          </h2>
          <div className="space-y-4">
            {data.benefits.map((b, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-800 pb-4">
                <span className="text-yellow-400 font-black text-2xl">
                  0{i + 1}
                </span>
                <p className="text-md md:text-lg text-gray-200 pt-1">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-900 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-2xl font-bold text-yellow-400 italic">
            &ldquo;{data.socialProof}&rdquo;
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto border-4 border-yellow-400 p-10">
          <h2 className="text-lg md:text-2xl lg:text-4xl font-black uppercase mb-6">
            The Investment:
          </h2>
          <p className="text-xl mb-4">{data.pricing}</p>
          {data.guarantee && (
            <p className="text-gray-400 text-sm mb-8">🛡️ {data.guarantee}</p>
          )}
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-12 py-5 text-md md:text-xl uppercase tracking-wide w-full transition-all">
            {data.cta} →
          </button>
        </div>
      </section>
    </div>
  );
}

function MinimalTemplate({
  data,
  productName,
}: {
  data: SalesPageOutput;
  productName: string;
}) {
  return (
    <div className="bg-white text-gray-900 font-serif min-h-screen">
      {/* Hero */}
      <section className="max-w-2xl mx-auto px-8 py-24">
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-8 font-sans">
          {productName}
        </p>
        <h1 className="text-4xl md:text-5xl font-light leading-tight mb-8 text-gray-900">
          {data.headline}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed mb-10 font-sans">
          {data.subheadline}
        </p>
        <button className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-sans font-semibold px-8 py-3 transition-all tracking-wide text-sm uppercase">
          {data.cta}
        </button>
      </section>

      <hr className="border-gray-100 max-w-2xl mx-auto" />

      {/* Description */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <p className="text-lg text-gray-600 leading-loose">
          {data.description}
        </p>
      </section>

      <hr className="border-gray-100 max-w-2xl mx-auto" />

      {/* Benefits */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-8">
          Benefits
        </h2>
        <ul className="space-y-5">
          {data.benefits.map((b, i) => (
            <li key={i} className="flex gap-4 text-gray-700 leading-relaxed">
              <span className="text-gray-300 font-sans">—</span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-gray-100 max-w-2xl mx-auto" />

      {/* Social Proof */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <p className="text-xl text-gray-500 italic leading-relaxed">
          &ldquo;{data.socialProof}&rdquo;
        </p>
      </section>

      <hr className="border-gray-100 max-w-2xl mx-auto" />

      {/* Pricing */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-6">
          Pricing
        </h2>
        <p className="text-xl text-gray-700 mb-4">{data.pricing}</p>
        {data.guarantee && (
          <p className="text-sm text-gray-400 mb-8 font-sans">
            {data.guarantee}
          </p>
        )}
        <button className="bg-gray-900 text-white font-sans font-semibold px-10 py-4 text-sm uppercase tracking-widest hover:bg-gray-700 transition-all">
          {data.cta}
        </button>
      </section>
    </div>
  );
}
