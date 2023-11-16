import { Configuration, OpenAIApi } from "openai-edge";
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    let authorization = req.headers.get('Authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
      authorization = authorization.substring(7);
    }

    console.log("authorization", authorization);
    
    const payload = await req.json();
    const config = new Configuration({
      apiKey: authorization ?? "",
    });

    const openai = new OpenAIApi(config);

    console.log("request", payload);

    const response = await openai.createChatCompletion(payload);

    console.log("response", response.status, response.statusText);

    return response;
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
