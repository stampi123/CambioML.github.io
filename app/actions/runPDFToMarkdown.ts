interface IParams {
  file: File | string | undefined;
}

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambdaClient = new LambdaClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY || '',
  },
});

const functionName = 'document_extraction_lambda';

async function getMarkdown(image: string): Promise<string> {
  const payload = {
    img: image,
    refine: true,
  };

  const command = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse', // sync
    Payload: new TextEncoder().encode(JSON.stringify(payload)),
  });

  const response = await lambdaClient.send(command);
  const responsePayload = JSON.parse(new TextDecoder('utf-8').decode(response.Payload));
  return responsePayload.html;
}

export const runPDFToMarkdown = async ({ file }: IParams) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid argument: 'file' is not an instance of 'File'.");
  }
  const pdfjsLib = window['pdfjsLib'];
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  const numPages = pdfDoc.numPages;
  const scale = 2;

  const doc: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (context) {
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert the canvas to a base64 encoded string
      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      // Get markdown from the Lambda function
      const markdown = await getMarkdown(imageBase64);
      console.log(`new markdown (${i}/${numPages}):\n`, markdown);
      doc.push(markdown);
    }
  }
  return doc;
};
