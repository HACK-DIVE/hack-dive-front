export default function UserDialog({ data }) {
  const { name, content, last } = data;
  return (
    <div className={`flex flex-col items-end p-2 ${!last ? "mb-2" : ""}`}>
      <div className="w-fit max-w-80 rounded-3xl rounded-br-none border border-[#1A4180] bg-[#02070E] p-8 text-[#DDDDDD]">
        {content}
      </div>
    </div>
  );
}
