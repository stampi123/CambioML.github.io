import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState, ExtractTab, ExtractedMDTable, MapTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ResultContainer from '../ResultContainer';
import { ArrowRight, ArrowsCounterClockwise, Check, CloudArrowUp, Table, X } from '@phosphor-icons/react';
import Button from '../../Button';
import { useProductionContext } from '../ProductionContext';
import { runExtractJob } from '@/app/actions/runExtractJob';
import { runExtractJob as runPreProdExtractJob } from '@/app/actions/preprod/runExtractJob';
import { AxiosError, AxiosResponse } from 'axios';
import TableSelectItem from './TableSelectItem';
import PulsingIcon from '../../PulsingIcon';
// import { PDFDocument } from 'pdf-lib';

const selectButtonStyles =
  'w-full text-center cursor-pointer border-[1px] text-neutral-600 border-neutral-400 rounded-lg flex gap-2 justify-center items-center hover:bg-neutral-100 hover:border-2 hover:font-semibold';

const MapTableSelectContainer = () => {
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const { apiURL, isProduction } = useProductionContext();
  const [tablePreviewIndex, setTablePreviewIndex] = useState(0);
  // const [pdfPages, setPdfPages] = useState<Blob[]>([]);

  const selectAllTables = (result: ExtractedMDTable[]) => {
    updateFileAtIndex(
      selectedFileIndex,
      'tableMapIndices',
      new Set(result.map((_: ExtractedMDTable, index: number) => index))
    );
  };
  function cleanTitle(text: string): string {
    let newText = text.replace(/^#+/, '').replaceAll('*', '');
    newText = newText.trim();
    return newText;
  }

  function extractMarkdownTable(markdown: string): ExtractedMDTable[] {
    const tables: ExtractedMDTable[] = [];

    // Regex pattern to extract titles and tables
    const tableRegex = /^(#+)?\s*(.*?)\s*\n\|(.+)\|\n((?:\|.*\|\n)+)?/gm;

    let match;

    while ((match = tableRegex.exec(markdown)) !== null) {
      let title = match[2] ? match[2].trim() : 'Table';
      const header = (match[3] || '').trim();
      const body = (match[4] || '').trim();

      let tableMarkdown = `| ${header} |\n${body}`;
      tableMarkdown = tableMarkdown.replaceAll('|:|', '|:-|');
      const isTitlePartOfTable = title.includes('|');

      if (isTitlePartOfTable) {
        tableMarkdown = title + '\n' + tableMarkdown;
        title = 'Table';
      } else {
        title = cleanTitle(title);
      }
      tables.push({ title, table: tableMarkdown, tableCsv: [], tableData: {} });
    }

    return tables;
  }

  // const splitPDF = async (file: File) => {
  //   if (file) {
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdfDoc = await PDFDocument.load(arrayBuffer);
  //     const pageCount = pdfDoc.getPageCount();

  //     const pages: Blob[] = [];
  //     for (let i = 0; i < pageCount; i++) {
  //       const newPdfDoc = await PDFDocument.create();
  //       const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
  //       newPdfDoc.addPage(copiedPage);
  //       const pdfBytes = await newPdfDoc.save();
  //       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //       pages.push(blob);
  //     }

  //     setPdfPages(pages);
  //   }
  // };

  function markdownToCsv(tableStr: string): string[][] {
    const rows = tableStr.trim().split('\n');
    const csvRows: string[][] = [];

    for (const row of rows) {
      if (row.startsWith('|') && row.endsWith('|')) {
        const columns = row.split('|').slice(1, -1);
        if (columns.every((col) => !col.trim() || col.trim().replace(/[-: ]/g, '') === '')) {
          continue; // This is a formatting row, so skip it
        }
        const cleanedColumns = columns.map((col) => col.trim()).filter((col) => col);
        if (cleanedColumns.length > 0) {
          csvRows.push(cleanedColumns);
        }
      }
    }

    return csvRows;
  }

  const processResult = (result: string[]) => {
    const initTables: ExtractedMDTable[] = [];
    const markdownTables: ExtractedMDTable[] = [];
    for (const page of result) {
      const extractedTables = extractMarkdownTable(page);
      initTables.push(...extractedTables);
    }
    if (initTables.length > 0) {
      const firstTable = initTables.shift();
      if (firstTable !== undefined) {
        markdownTables.push(firstTable);
      }
    }
    for (const table of initTables) {
      if (table['title'] === markdownTables[markdownTables.length - 1]['title']) {
        const index = table['table'].indexOf('\n', table['table'].indexOf('\n') + 1);
        const tableBody = table['table'].substring(index + 1);
        markdownTables[markdownTables.length - 1].table += `\n${tableBody}`;
      } else {
        markdownTables.push(table);
      }
    }
    for (const table of markdownTables) {
      table['tableCsv'] = markdownToCsv(table['table']);
      if (table['tableCsv'][0].length > 2) {
        for (const row of table['tableCsv'].slice(1)) {
          for (let i = 1; i < row.length; i++) {
            const colIdx = table['tableCsv'][0].length === row.length ? i : i - 1;
            const colHeader = table['tableCsv'][0][colIdx];
            const rowHeader = row[0];
            const dataKey = `${colHeader}: ${rowHeader}`;
            table['tableData'][dataKey] = row[i];
          }
        }
      } else {
        for (const row of table['tableCsv']) {
          table['tableData'][row[0]] = row[1];
        }
      }
      console.log(`---${table['title']}---`);
      console.log('tableCSV', table['tableCsv']);
      console.log('tableData', table['tableData']);
    }

    return markdownTables;
  };

  const handleSuccess = (response: AxiosResponse, page?: number) => {
    console.log(`handleSuccess page ${page}`, response.data);
    const result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.DONE_EXTRACTING);
    updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT);
    const markdownTables = processResult(result);
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractResult', markdownTables);
    selectAllTables(markdownTables);
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
    handleFileExtract();
  };

  const displayTable = () => {
    if (selectedFile) {
      if (selectedFile.tableMdExtractResult.length === 0) {
        return [''];
      }
      if (selectedFile.tableMdExtractResult[tablePreviewIndex]['table'] !== '') {
        return [
          `### ${selectedFile.tableMdExtractResult[tablePreviewIndex]['title']}\n${selectedFile.tableMdExtractResult[tablePreviewIndex]['table']}`,
        ];
      }
    }
    return [''];
  };

  const handleFileExtract = async () => {
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractTab.FILE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.UPLOADING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'tableMdExtractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please try again.`);
      return;
    }

    // if (selectedFile?.file instanceof File) {
    //   splitPDF(selectedFile.file);
    // }
    if (selectedFile && selectedFileIndex !== null) {
      if (isProduction) {
        runExtractJob({
          api_url: apiURL,
          fileData,
          filename,
          selectedFile,
          selectedFileIndex,
          token,
          queryType: 'job_result',
          updateFileAtIndex,
          handleSuccess,
          handleError,
          handleTimeout,
        });
      } else {
        runPreProdExtractJob({
          api_url: apiURL,
          fileData,
          filename,
          selectedFile,
          selectedFileIndex,
          token,
          queryType: 'job_result',
          updateFileAtIndex,
          handleSuccess,
          handleError,
          handleTimeout,
          page: 0,
        });
      }
    }
  };

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
            <Button label="Extract Tables" onClick={handleFileExtract} small labelIcon={Table} />
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
