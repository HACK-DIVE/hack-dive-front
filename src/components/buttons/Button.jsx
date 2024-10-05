export default function Button({ text, isSelected = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`max-h-12 w-fit cursor-pointer rounded-[44px] border border-[#4E6A97] bg-[#181818] px-9 py-[10px] text-white hover:bg-[#4E6A97]${
        isSelected ? " " + "bg-[#2B4BDA]" : ""
      }`}
    >
      {text}
    </div>
  );
}
