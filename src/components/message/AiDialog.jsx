export default function AiDialog({ data }) {
  const { name, content, last } = data;

  return (
    <div className={`whitespace-pre-wrap p-2 ${!last ? "mb-2" : ""} `}>
      {/* <div className="mb-2 inline-block bg-slate-300 p-2">{name}</div> */}
      <div className="w-fit max-w-80 rounded-3xl rounded-bl-none border border-[#4E6A97] bg-[#081425] p-8 text-[#84B8E7]">
        {content}
      </div>
    </div>
  );
}
