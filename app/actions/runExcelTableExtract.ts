import * as XLSX from 'xlsx';

interface IParams {
  excelFile: File;
}

const SHEETS_2_PROCESS = 20;

export const runExcelTableExtract = ({ excelFile }: IParams): Promise<string[]> => {
  console.log(`Extracting ${excelFile.name}`);
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, sheetStubs: true });
        let sheetCount = 0;
        const htmlTables: string[] = [];

        for (const sheetName of workbook.SheetNames) {
          if (sheetCount >= SHEETS_2_PROCESS) {
            break;
          }
          const worksheet = workbook.Sheets[sheetName];
          const sheetData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          //   console.log(sheetName);
          //   console.log('Sheet Data\n', JSON.stringify(sheetData));
          sheetCount++;
          //   const tables = combineTables(sheetData);
          //   tables.forEach((table) => {
          //     htmlTables.push(generateHtmlTable(table));
          //   });
          const sheetTable: string = generateHTMLSheetTable(sheetData);
          htmlTables.push(sheetTable);
        }

        resolve(htmlTables);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(excelFile);
  });
};

function generateHTMLSheetTable(tableData: string[][]): string {
  let tableHtml = '<table><tbody>';

  tableData.forEach((row) => {
    tableHtml += '<tr>';
    row.forEach((cell) => {
      tableHtml += `<td>${cell !== null ? cell : ''}</td>`;
    });
    tableHtml += '</tr>';
  });

  tableHtml += '</tbody></table>';
  return tableHtml;
}

// function combineTables(data: (string | null | undefined)[][]): string[][][] {
//   const tables: string[][][] = [];
//   let currentTable: string[][] = [];
//   let headerDetected = false;

//   data.forEach((row) => {
//     // Heuristic to detect table headers: row should not be empty and should contain at least 2 non-null values
//     const nonNullCount = row.filter((cell) => cell !== null).length;
//     if (nonNullCount >= 2) {
//       if (headerDetected) {
//         currentTable.push(row as string[]);
//       } else {
//         if (currentTable.length > 0) {
//           tables.push(currentTable);
//           currentTable = [];
//         }
//         headerDetected = true;
//         currentTable.push(row as string[]);
//       }
//     } else {
//       headerDetected = false;
//     }
//   });

//   if (currentTable.length > 0) {
//     tables.push(currentTable);
//   }

//   // Combine tables with the same header length
//   for (let i = 1; i < tables.length; i++) {
//     if (tables[i][0].length === tables[i - 1][0].length) {
//       tables[i - 1].push(...tables[i]);
//       tables[i] = [];
//     }
//   }

//   const outputTables: string[][][] = tables.filter((table) => table.length > 0);

//   return outputTables;
// }

// function generateHtmlTable(tableData: string[][]): string {
//   let tableHtml = '<table><tbody>';

//   tableData.forEach((row) => {
//     tableHtml += '<tr>';
//     row.forEach((cell) => {
//       tableHtml += `<td>${cell !== null ? cell : ''}</td>`;
//     });
//     tableHtml += '</tr>';
//   });

//   tableHtml += '</tbody></table>';
//   return tableHtml;
// }
