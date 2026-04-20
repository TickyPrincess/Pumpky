export default function AppLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="panel p-4 h-20 shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 panel h-72 shimmer" />
        <div className="xl:col-span-4 panel h-72 shimmer" />
      </div>
    </div>
  );
}
