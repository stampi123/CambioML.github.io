import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { downloadFile } from './downloadFile';

interface IParams {
  excelFile: File;
}

export async function convertExcelToPdf({ excelFile }: IParams) {
  console.log(`Converting ${excelFile.name}`);
  // Read the Excel file
  const data = await excelFile.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Create a new jsPDF instance
  const pdf = new jsPDF('p', 'mm', 'a4');
  let pageAdded = false;
  let sheetCount = 1;

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    console.log(`Processsing ${sheetName} [${sheetCount}/${workbook.SheetNames.length}]`);
    sheetCount++;

    if (worksheet['!ref']) {
      const chunkSize = 100; // Number of rows per chunk
      const totalRows = XLSX.utils.decode_range(worksheet['!ref']).e.r + 1;
      const totalCols = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1;

      for (let startRow = 0; startRow < totalRows; startRow += chunkSize) {
        const endRow = Math.min(startRow + chunkSize, totalRows);
        const subWorksheet: XLSX.WorkSheet = {};

        // Copy sub-range of rows into a new worksheet
        for (let row = startRow; row < endRow; row++) {
          for (let col = 0; col < totalCols; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (worksheet[cellAddress]) {
              subWorksheet[cellAddress] = worksheet[cellAddress];
            }
          }
        }

        // Set the range for the sub-worksheet
        subWorksheet['!ref'] = XLSX.utils.encode_range({
          s: { r: startRow, c: 0 },
          e: { r: endRow - 1, c: totalCols - 1 },
        });

        const partialHtml = XLSX.utils.sheet_to_html(subWorksheet, { header: 'A1' });

        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.innerHTML = partialHtml;
        document.body.appendChild(tempContainer);

        // Use html2canvas to capture the element as a canvas
        const canvas = await html2canvas(tempContainer);

        // Convert the canvas to an image
        const imgData = canvas.toDataURL('image/png');

        // Calculate image dimensions to fit the PDF page
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (pageAdded) {
          pdf.addPage();
        } else {
          pageAdded = true;
        }

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Remove the temporary container
        document.body.removeChild(tempContainer);
      }
    }
  }

  // Save the PDF
  pdf.save('test.pdf');
  const pdfArrayBuffer = pdf.output('arraybuffer');

  downloadFile({
    filename: 'test',
    fileContent: pdfArrayBuffer,
    fileType: 'application/pdf',
    suffix: '_test.pdf',
  });
}
