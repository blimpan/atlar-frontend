export default function LoadingGif() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        src="/images/loading.gif"
        alt="Loading..."
        width={100}
        height={100}
        className="aspect-square w-[100px] md:w-[125px]"
      />
    </div>
  );
}
