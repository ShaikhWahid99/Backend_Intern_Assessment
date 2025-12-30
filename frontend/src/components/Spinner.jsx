export default function Spinner() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-5 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin" />
      <span className="text-sm text-gray-600">Loading</span>
    </div>
  );
}
