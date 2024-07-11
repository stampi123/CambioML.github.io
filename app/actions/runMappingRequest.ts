import OpenAI from 'openai';

const MAX_RETRIES = 3;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

interface IParams {
  tableSchema: string[];
  keysToMap: string[];
}

function parseApiResponse(response: string): { [key: string]: string } {
  try {
    let trimmedResponse = response.trim();

    if (trimmedResponse.startsWith('```json') && trimmedResponse.endsWith('```')) {
      trimmedResponse = trimmedResponse.slice(7, -3).trim();
    }

    trimmedResponse = trimmedResponse.replace(/\bNone\b/g, 'null');

    const parsedResponse = JSON.parse(trimmedResponse);

    if (typeof parsedResponse === 'string') {
      return JSON.parse(parsedResponse);
    }

    return parsedResponse;
  } catch (error) {
    throw new Error('Invalid JSON response');
  }
}

export const runMappingRequest = async ({ tableSchema, keysToMap }: IParams) => {
  if (keysToMap.length === 0) {
    throw new Error('The keysToMap array is empty. At least one key is required.');
  }

  const getMappingPrompt = (schema: string[], keys: string[]) => `
    Here is a list of \`raw_schema\`:
    ${JSON.stringify(schema)}
    Your goal is to map each string in the \`raw_schema\` to a string in the \`db_schema\` below:
    ${JSON.stringify(keys)}
    Return a dictionary with keys from the \`db_schema\` and values as the matched key from \`raw_schema\`.
    Make sure the mapping is 1 to 1 only.
    If no value is found, then return None. Return the dictionary in JSON ONLY, no other text.`;

  const fetchMapping = async (keys: string[]) => {
    const prompt = getMappingPrompt(tableSchema, keys);
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        { role: 'system', content: 'You are an expert in mapping schema from financial documents.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4o',
      max_tokens: 4096,
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    const rawResponse = chatCompletion.choices[0].message.content || '';
    const response = parseApiResponse(rawResponse);
    return response;
  };

  let retries = 0;
  let keysToRetry = keysToMap;
  const cumulativeResult: { [key: string]: string } = {};

  while (retries < MAX_RETRIES && keysToRetry.length > 0) {
    const mappingResult = await fetchMapping(keysToRetry);

    Object.keys(mappingResult).forEach((key) => {
      if (mappingResult[key] !== null) {
        cumulativeResult[key] = mappingResult[key];
      }
    });

    keysToRetry = Object.keys(mappingResult).filter((key) => mappingResult[key] === null);

    if (keysToRetry.length === 0) {
      return cumulativeResult;
    }

    retries++;
    if (retries < MAX_RETRIES) {
      console.log(`Retrying for keys: ${JSON.stringify(keysToRetry)} (Attempt ${retries + 1}/${MAX_RETRIES})`);
    } else {
      console.log(`Reached maximum retries (${MAX_RETRIES}).`);
    }
  }

  return cumulativeResult;
};
