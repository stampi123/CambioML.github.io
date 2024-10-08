import { test, expect, Page } from '@playwright/test';
import stringSimilarity from 'string-similarity';
import { testFileData } from './data/testData';

const TEST_USERNAME = 'jojo+test@cambioml.com';
const TEST_PASSWORD = 'Test1234!';
const SIMILARITY_THRESHOLD = 0.95;

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('should log in successfully', async () => {
  await page.goto('/sandbox');
  await page.click('text=Login');
  await page.waitForURL('https://dev-5m1dgbqjz2jua7l2.us.auth0.com/**', { timeout: 5000 });
  await page.fill('input[name="username"]', TEST_USERNAME);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL('**/sandbox', { timeout: 10000 });
  } catch (e) {
    console.error('Login failed: Redirect to /sandbox did not happen.');

    const loginErrorVisible = await page.isVisible('text="invalid credentials"');
    expect(loginErrorVisible).toBeTruthy();
    console.log('Login error message confirmed.');

    throw new Error('Login failed due to invalid credentials.');
  }
});

// Loop through the file uploads as separate tests
for (const file of testFileData) {
  const testFilename = file.name.split('/').pop()!;

  test.describe(`File Upload and Extraction: ${file.name}`, () => {
    test('should upload the file', async () => {
      await page.click('#open-upload-modal-btn');
      await page.waitForSelector('#upload-modal');
      expect(await page.isVisible('#upload-modal')).toBeTruthy();

      const fileInput = await page.$('#upload-file-input');
      if (fileInput) {
        await fileInput.setInputFiles(file.name);
      } else {
        throw new Error('File input not found');
      }

      const fileItems = await page.$$('.file-item-name');
      const uploadedFileItem = fileItems.find(async (item) => {
        const name = await item.textContent();
        return name?.includes(testFilename);
      });

      expect(uploadedFileItem).not.toBeNull();
      if (uploadedFileItem) {
        await uploadedFileItem.click();
      }
    });

    test('should extract the file with PII masking', async () => {
      const extractFileNameItem = await page.waitForSelector('#extract-file-name', { timeout: 5000 });
      if (extractFileNameItem) {
        const extractFileName = await extractFileNameItem.textContent();
        expect(extractFileName).toEqual(testFilename);
      } else {
        throw new Error('Extract file name item not found');
      }

      await page.click('#extract-plain-text-btn');
      await page.waitForSelector('#result-container');
      const extractedText = await page.textContent('#result-container');
      expect(extractedText).not.toBeNull();

      if (!extractedText) {
        throw new Error('Extracted text is null');
      }

      const similarity = stringSimilarity.compareTwoStrings(file.maskPIIOutput, extractedText);
      expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
      console.log(`Similarity: ${similarity}`);
    });

    test('should extract the file without PII masking', async () => {
      await page.click('#retry-extract-btn');
      await page.waitForSelector('#remove-pii-checkbox', { timeout: 5000 });
      await page.click('#remove-pii-checkbox');
      await page.click('#extract-plain-text-btn');
      await page.waitForSelector('#result-container');
      const extractedText = await page.textContent('#result-container');
      expect(extractedText).not.toBeNull();

      if (!extractedText) {
        throw new Error('Extracted text is null');
      }

      const similarity = stringSimilarity.compareTwoStrings(file.noMaskPIIOutput, extractedText);
      expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
      console.log(`Similarity: ${similarity}`);
    });
  });
}
