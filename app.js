import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {

    const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions.
          You have access to following tools:
          1. searchWeb({query}:{query:string}) //search the latest information and realtime data on the internet.
          current date and time: ${new Date().toUTCString()}`,
    },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("you:");
    if (question == 'bye') break
    messages.push(
        {
        role: "user",
        content: question,
        },
    )

    while (true) {
      const completions = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data on the internet.",
              parameters: {
                // JSON Schema object
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(completions.choices[0].message);

      const toolCalls = completions.choices[0].message.tool_calls;

      if (!toolCalls) {
        console.log(`Assistent: ${completions.choices[0].message.content}`);
        break;
      }
      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName == "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }
  }
  rl.close()
}

main();

async function webSearch({ query }) {
  console.log("Caling Websearch");
  const res = await tvly.search(query);

  const finalResult = res.results.map((result) => result.content).join("\n\n");
  return finalResult;
}
