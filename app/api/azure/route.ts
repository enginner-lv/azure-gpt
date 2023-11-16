import {Configuration, OpenAIApi} from "openai-edge";
import {OpenAIStream, StreamingTextResponse} from "ai";

const config = new Configuration({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseOptions: {
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY,
    },
  },
  basePath: `https://west-europe-01.openai.azure.com/openai/deployments/test01`,
  defaultQueryParams: new URLSearchParams({
    "api-version": process.env.AZURE_OPENAI_API_VERSION,
  } as any),
});

const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("request", payload?.messages);

    const response = await openai.createChatCompletion(payload);

    console.log("response", response.status, response.statusText);

    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
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
