export default function UserDialog({ data }) {
  const { name, message, last } = data;
  return (
    <div
      className={`flex flex-col items-end bg-yellow-50 p-2 ${!last ? "mb-2" : ""}`}
    >
      {/* <div className="mb-2 inline-block bg-slate-300 p-2">{name}</div> */}
      <div className="w-fit bg-slate-300 p-2">{message}</div>
    </div>
  );
}
