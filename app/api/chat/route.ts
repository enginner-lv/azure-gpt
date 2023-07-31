import {Configuration, OpenAIApi} from "openai-edge";
import {OpenAIStream, StreamingTextResponse} from "ai";

// Create an OpenAI API client (that's edge friendly!)
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

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const {messages} = await req.json();

    console.log("messages", messages);

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    // Convert the response into a friendly text-stream
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
