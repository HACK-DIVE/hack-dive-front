export default function AiDialog({ data }) {
  const { name, message, last } = data;

  return (
    <div className={`bg-blue-700 p-2 ${!last ? "mb-2" : ""}`}>
      {/* <div className="mb-2 inline-block bg-slate-300 p-2">{name}</div> */}
      <div className="w-fit bg-slate-300 p-2">{message}</div>
    </div>
  );
}
