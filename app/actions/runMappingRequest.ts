import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '', // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});

interface IParams {
  tableSchema: string[];
  keysToMap: string[];
}

function parseApiResponse(response: string): { [key: string]: string } {
  try {
    // Trim the response to remove leading/trailing whitespace
    let trimmedResponse = response.trim();

    // Check if the response starts and ends with ```json and ``` respectively
    if (trimmedResponse.startsWith('```json') && trimmedResponse.endsWith('```')) {
      // Remove the markdown code block delimiters
      trimmedResponse = trimmedResponse.slice(7, -3).trim();
    }

    // Replace `None` with `null`
    trimmedResponse = trimmedResponse.replace(/\bNone\b/g, 'null');

    // Try to parse the cleaned response as JSON
    const parsedResponse = JSON.parse(trimmedResponse);

    // Check if the parsed response is a stringified JSON
    if (typeof parsedResponse === 'string') {
      return JSON.parse(parsedResponse);
    }

    // Return the parsed JSON object
    return parsedResponse;
  } catch (error) {
    // Handle cases where response is not a valid JSON string
    throw new Error('Invalid JSON response');
  }
}

export const runMappingRequest = async ({ tableSchema, keysToMap }: IParams) => {
  if (keysToMap.length === 0) {
    throw new Error('The keysToMap array is empty. At least one key is required.');
  }
  const prompt = `Here is a list of \`raw_schema\`:
    ${JSON.stringify(tableSchema)}
    Your goal is to map each string in the \`raw_schema\` to a string the \`db_schema\` below:
    ${JSON.stringify(keysToMap)}
    Return a dictionary with keys from the \`db_schema\` and values as the matched key from \`raw_schema\`.
    Make sure the mapping is 1 to 1 only.
    If no value is found, then return None. Return the dictionary in JSON ONLY, no other text. for example, DO NOT include`;

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: 'system', content: 'You are an expert in mapping schema from financial documents.' },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o',
    max_tokens: 4096,
  };
  console.log('[runMappingRequest]: IN : ', params);
  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
  const rawResponse = chatCompletion.choices[0].message.content || '';
  console.log('[chatcompletion]:', chatCompletion.choices[0].message.content);
  const response = parseApiResponse(rawResponse);
  console.log('cleaned response:', response);
  return response;
};
