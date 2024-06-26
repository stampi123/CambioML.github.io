import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState, ExtractTab, ExtractedMDTable, MapTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ResultContainer from '../ResultContainer';
import { ArrowRight, ArrowsCounterClockwise, Check, CloudArrowUp, Table, X } from '@phosphor-icons/react';
import Button from '../../Button';
import { useProductionContext } from '../ProductionContext';
// import { runExtractJob } from '@/app/actions/runExtractJob';
// import { runExtractJob as runPreProdExtractJob } from '@/app/actions/preprod/runExtractJob';
import { runUploadRequestJob as runPreProdUploadRequestJob } from '@/app/actions/preprod/runUploadRequestJob';
import { runUploadRequestJob } from '@/app/actions/runUploadRequestJob';
import { AxiosError, AxiosResponse } from 'axios';
import TableSelectItem from './TableSelectItem';
import PulsingIcon from '../../PulsingIcon';
// import DOMParser from 'domparser';

// import { runPDFToMarkdown } from '@/app/actions/runPDFToMarkdown';

const selectButtonStyles =
  'w-full text-center cursor-pointer border-[1px] text-neutral-600 border-neutral-400 rounded-lg flex gap-2 justify-center items-center hover:bg-neutral-100 hover:border-2 hover:font-semibold';

const MapTableSelectContainer = () => {
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token, clientId } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const { apiURL, isProduction } = useProductionContext();
  const [tablePreviewIndex, setTablePreviewIndex] = useState(0);

  const selectAllTables = (result: ExtractedMDTable[]) => {
    updateFileAtIndex(
      selectedFileIndex,
      'tableMapIndices',
      new Set(result.map((_: ExtractedMDTable, index: number) => index))
    );
  };
  function extractTitleFromTable(tableHtml: HTMLTableElement): string {
    const firstCell = tableHtml.querySelector('tr td')?.textContent?.trim() || 'Table';
    return firstCell;
  }

  // function convertHtmlTableToCsv(tableHtml: string): string[] {
  //   const csvRows: string[] = [];
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(tableHtml, 'text/html');
  //   const rows = doc.querySelectorAll('tr');

  //   rows.forEach((row) => {
  //     const cells = Array.from(row.querySelectorAll('th, td')).map((cell) => cell.textContent?.trim() || '');
  //     csvRows.push(cells.join(','));
  //   });

  //   return csvRows;
  // }

  // function parseHtmlTable(tableHtml: string): any[] {
  //   const tableData: any[] = [];
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(tableHtml, 'text/html');
  //   const rows = doc.querySelectorAll('tr');

  //   rows.forEach((row) => {
  //     const rowData: any = {};
  //     const cells = Array.from(row.querySelectorAll('th, td'));

  //     cells.forEach((cell, index) => {
  //       rowData[`column${index + 1}`] = cell.textContent?.trim() || '';
  //     });

  //     tableData.push(rowData);
  //   });

  //   return tableData;
  // }

  function extractHtmlTable(html: string): ExtractedMDTable[] {
    const tables: ExtractedMDTable[] = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tableElements = doc.querySelectorAll('table');

    tableElements.forEach((tableElement) => {
      const title = extractTitleFromTable(tableElement);

      tables.push({
        title,
        table: tableElement.outerHTML,
        tableCsv: [], //convertHtmlTableToCsv(tableHtml),
        tableData: {}, //parseHtmlTable(tableHtml),
      });
    });

    return tables;
  }

  function mergeTables(firstTableHTML: string, secondTableHTML: string): string {
    const parser = new DOMParser();
    const firstDoc = parser.parseFromString(firstTableHTML, 'text/html');
    const secondDoc = parser.parseFromString(secondTableHTML, 'text/html');

    const firstTable = firstDoc.querySelector('table tbody');
    const secondTableRows = secondDoc.querySelectorAll('table tbody tr');

    secondTableRows.forEach((row, index) => {
      // Skip the header row (index 0)
      if (index > 0) {
        firstTable?.appendChild(row);
      }
    });

    return firstDoc.body.innerHTML;
  }
  function hasAtLeastNNonEmptyStrings(arr: string[], numStrings: number): boolean {
    const nonEmptyStrings = arr.filter((str) => str.trim() !== '');
    return nonEmptyStrings.length >= numStrings;
  }
  function countEmptyStrings(arr: string[]): number {
    let emptyCount = 0;
    arr.forEach((str) => {
      if (str.trim() === '') emptyCount++;
    });
    return emptyCount;
  }
  function makeUnique(arr: string[]): string[] {
    const countMap: Map<string, number> = new Map();

    return arr.map((item) => {
      if (countMap.has(item)) {
        const count = countMap.get(item)! + 1;
        const newItem = `${item}_${count}`;
        countMap.set(item, count);
        countMap.set(newItem, 0); // Initialize the count for the new item
        return newItem;
      } else {
        countMap.set(item, 0);
        return item;
      }
    });
  }

  const extractTableData = (htmlTable: string, tableTitle: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTable, 'text/html');
    const rows = doc.querySelectorAll('table tbody tr');
    const tableRows: string[][] = [];
    const tableData: { [key: string]: string[] } = {};
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const cellArray: string[] = [];
      cells.forEach((cell) => {
        const cellContent = cell.textContent?.trim() || '';
        cellArray.push(cellContent);
      });
      if (hasAtLeastNNonEmptyStrings(cellArray, 2)) tableRows.push(cellArray);
    });
    if (tableRows[0].length === 2) {
      tableRows.forEach((tableRow) => {
        tableData[`${tableTitle}-${tableRow[0]}`] = [tableRow[1]];
      });
    } else {
      let headers: string[] = [];
      tableRows.forEach((tableRow) => {
        if (headers.length === 0) {
          if (countEmptyStrings(tableRow) < 3) {
            headers = makeUnique(tableRow);
            headers.forEach((header) => {
              tableData[`${tableTitle}-${header}`] = [];
            });
          }
        } else {
          tableRow.forEach((cellData, i) => {
            tableData[`${tableTitle}-${headers[i]}`].push(cellData);
          });
        }
      });
    }
    return tableData;
  };

  const processResult = (result: string[]) => {
    const initTables: ExtractedMDTable[] = [];
    const htmlTables: ExtractedMDTable[] = [];
    for (const page of result) {
      const extractedTables = extractHtmlTable(page);
      initTables.push(...extractedTables);
    }
    if (initTables.length > 0) {
      const firstTable = initTables.shift();
      if (firstTable !== undefined) {
        htmlTables.push(firstTable);
      }
    }
    for (const table of initTables) {
      if (table['title'] === htmlTables[htmlTables.length - 1]['title']) {
        htmlTables[htmlTables.length - 1].table = mergeTables(
          htmlTables[htmlTables.length - 1]['table'],
          table['table']
        );
      } else {
        htmlTables.push(table);
      }
    }
    for (const table of htmlTables) {
      table['tableData'] = extractTableData(table['table'], table['title']);
    }

    return htmlTables;
  };

  const handleSuccess = (response: AxiosResponse) => {
    const result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.DONE_EXTRACTING);
    updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT);
    const htmlTables = processResult(result);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractResult', htmlTables);
    selectAllTables(htmlTables);
    toast.success(`Generated table(s) from ${filename}!`);
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
        return;
      }
    }
    toast.error(`Error transforming ${filename}. Please try again.`);
    console.log('error', e);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
    toast.error(`Transform request for ${filename} timed out. Please try again.`);
  };

  const handleRetry = () => {
    setTablePreviewIndex(0);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractResult', ['']);
    handleTableExtract();
  };

  const displayTable = () => {
    if (selectedFile) {
      if (selectedFile.tableMdExtractResult.length === 0) {
        return [''];
      }
      if (selectedFile.tableMdExtractResult[tablePreviewIndex]['table'] !== '') {
        return [
          `<h1><strong>${selectedFile.tableMdExtractResult[tablePreviewIndex]['title']}</strong></h1>\n${selectedFile.tableMdExtractResult[tablePreviewIndex]['table']}`,
        ];
      }
    }
    return [''];
  };

  const handleTableExtract = async () => {
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractTab.FILE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.EXTRACTING);

    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }

    if (selectedFileIndex === null || !selectedFile || !fileData) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      return;
    }
    if (isProduction) {
      runUploadRequestJob({
        api_url: apiURL,
        clientId,
        token,
        sourceType: 's3',
        selectedFile,
        fileData,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt: '',
          use_textract: true,
        },
        selectedFileIndex,
        filename,
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      });
    } else {
      runPreProdUploadRequestJob({
        api_url: apiURL,
        clientId,
        token,
        sourceType: 's3',
        selectedFile,
        fileData,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt: '',
          use_textract: true,
        },
        selectedFileIndex,
        filename,
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      });
    }
  };

  // const handleTableExtractOLD = async () => {
  //   if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
  //     updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractTab.FILE_EXTRACT);
  //   }
  //   updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.UPLOADING);
  //   const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
  //   if (!fileData) {
  //     updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
  //     toast.error(`Error extracting ${filename}. Please try again.`);
  //     return;
  //   }

  //   // if (selectedFile?.file instanceof File) {
  //   //   splitPDF(selectedFile.file);
  //   // }
  //   if (selectedFile && selectedFileIndex !== null) {
  //     if (isProduction) {
  //       runExtractJob({
  //         api_url: apiURL,
  //         fileData,
  //         filename,
  //         selectedFile,
  //         selectedFileIndex,
  //         token,
  //         queryType: 'job_result',
  //         updateFileAtIndex,
  //         handleSuccess,
  //         handleError,
  //         handleTimeout,
  //       });
  //     } else {
  //       runPreProdExtractJob({
  //         api_url: apiURL,
  //         fileData,
  //         filename,
  //         selectedFile,
  //         selectedFileIndex,
  //         token,
  //         queryType: 'job_result',
  //         updateFileAtIndex,
  //         handleSuccess,
  //         handleError,
  //         handleTimeout,
  //         page: 0,
  //       });
  //     }
  //   }
  // };

  const handleContinueClick = () => {
    updateFileAtIndex(selectedFileIndex, 'mapTab', MapTab.MAP_SCHEMA);
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      if (thisFile.file instanceof File) {
        setFilename(thisFile.file.name);
      } else {
        setFilename(thisFile.file);
      }
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);
  return (
    <div className="h-full grid grid-cols-[280px_1fr] lg:grid-cols-[350px_1fr] grid-rows-[1fr_50px] gap-4">
      <div className="h-full p-4 gap-2 grid grid-rows-[30px_25px_1fr_55px] border-[1px] border-solid rounded-xl">
        {selectedFile?.tableMdExtractState === ExtractState.DONE_EXTRACTING && (
          <>
            <div className="row-span-1 text-lg font-semibold">Select Tables</div>
            {selectedFile.tableMdExtractResult.length > 0 ? (
              <>
                <div className="row-span-1 h-full w-full flex gap-2">
                  <div
                    onClick={() => selectAllTables(selectedFile.tableMdExtractResult)}
                    className={`${selectButtonStyles} hover:text-green-500`}
                  >
                    Select All
                    <Check />
                  </div>
                  <div onClick={() => selectAllTables([])} className={`${selectButtonStyles} hover:text-rose-500`}>
                    Deselect All
                    <X />
                  </div>
                </div>
                <div className="row-span-1 overflow-auto relative box-border">
                  <div className="w-full h-fit flex flex-col items-start justify-center absolute gap-2">
                    {selectedFile?.tableMdExtractResult.map((table, i) => (
                      <TableSelectItem
                        key={i}
                        tableName={table.title}
                        tableIndex={i}
                        tablePreviewIndex={tablePreviewIndex}
                        setTablePreviewIndex={setTablePreviewIndex}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="row-span-2">
                No tables found in <span className="font-semibold">{filename}</span>
              </div>
            )}
            <div className="row-span-1 h-full flex items-center justify-center pb-2">
              <Button label="Re-run Extract" onClick={handleRetry} small labelIcon={ArrowsCounterClockwise} />
            </div>
          </>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.READY && (
          <div className="row-span-4 flex flex-col items-center justify-center h-full">
            <Button label="Extract Tables" onClick={handleTableExtract} small labelIcon={Table} />
          </div>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.UPLOADING && (
          <div className="row-span-4 flex flex-col items-center justify-center h-full">
            <div className="text-xl font-semibold text-neutral-500">Uploading File</div>
          </div>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.EXTRACTING && (
          <div className="row-span-4 flex flex-col items-center justify-center h-full">
            <div className="text-xl font-semibold text-neutral-500">Extracting Tables</div>
          </div>
        )}
      </div>
      <div className="h-full">
        {selectedFile?.tableMdExtractState === ExtractState.READY && (
          <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl text-neutral-300">
            <Table size={40} />
          </div>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.UPLOADING && (
          <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl">
            <PulsingIcon Icon={CloudArrowUp} size={40} />
          </div>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.EXTRACTING && (
          <div className="flex flex-col items-center justify-center h-full border-[1px] border-neutral-200 rounded-xl">
            <PulsingIcon Icon={Table} size={40} />
          </div>
        )}
        {selectedFile?.tableMdExtractState === ExtractState.DONE_EXTRACTING && (
          <ResultContainer extractResult={displayTable()} />
        )}
      </div>
      <div className="col-span-2 flex gap-4">
        <Button
          label="Go to Map"
          onClick={handleContinueClick}
          small
          labelIcon={ArrowRight}
          disabled={
            (selectedFile && selectedFile?.tableMdExtractResult.length === 0) ||
            selectedFile?.tableMdExtractState !== ExtractState.DONE_EXTRACTING
          }
        />
      </div>
      {/* {pdfPages.map((page, index) => (
        <a href={URL.createObjectURL(page)} download={`page-${index + 1}.pdf`} key={index}>
          Download Page {index + 1}
        </a>
      ))} */}
    </div>
  );
};

export default MapTableSelectContainer;
