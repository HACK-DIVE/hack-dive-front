let messages = [];

export async function GET() {
  console.log("getMessage", messages);
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const newMessage = await req.json();
  //TODO 나중엔 테스트용인 ... 지울 것
  messages.push(...newMessage);

  console.log(newMessage);
  console.log(messages);
  return new Response(JSON.stringify(messages), { status: 201 });
}
