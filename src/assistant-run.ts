import { openai } from "./assistant-conf";
import { AssistantMessageData } from "./types";

// Run OpenAI Assistant
export async function runAssistant(assistantId: string, threadId: any, userInput: string) {
  try {
    //  Adding a Message in the Thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userInput,
    });

    // Run the Assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Check the Run status and retrieve the Assistant's response
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    while (
      runStatus.status !== "completed" &&
      runStatus.status !== "failed" &&
      runStatus.status !== "cancelled" &&
      runStatus.status !== "expired"
    ) {
      // Should change to half a sec when calling Functions
      await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }
    // Should plug in here status = action_needed
    // Once the status is returned, it should have the function name
    // Then call the tools > all required functions should be more than one should be executed
    // Return of all tools should be to the specific endpoint with the thredid and tool call combined of all at once
    // Submit the response from tools

    if (runStatus.status === "completed") {
      // Retrieve Messages
      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessages: AssistantMessageData[] = messages.data.filter(
        (message: any) => message.role === "assistant"
      );

      if (assistantMessages.length > 0) {
        const response = assistantMessages[0].content[0].text.value;
        return response;
      } else {
        return "Assistant provided no response.";
      }
    } else {
      return `Run failed with status: ${runStatus.status}`;
    }
  } catch (error: any) {
    console.error("Error running assistant:", error);
    return `Error: ${error.message}`;
  }
}
