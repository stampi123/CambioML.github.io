import { useEffect, useState } from 'react';
import { TransformResult, OutputItem } from '../../types/PlaygroundTypes';

interface QATableProps {
  transformResult: TransformResult;
  updateDisplayTable: (resultList: string[][]) => void;
}

const cellStyle = 'p-2 text-center whitespace-pre-wrap';
const contextColWidth = '50%';
const otherColWidth = '25%';

const QATable = ({ transformResult, updateDisplayTable }: QATableProps) => {
  const [resultList, setResultList] = useState<string[][]>([]);
  useEffect(() => {
    const thisList: string[][] = [];
    transformResult.results.forEach((itemList) => {
      itemList.forEach((item) => {
        if (Array.isArray(item.output)) {
          item.output.forEach((outputItem: OutputItem) => {
            outputItem.response.forEach((response) => {
              const { context, question, answer } = response;
              thisList.push([context, question, answer]);
            });
          });
        }
      });
    });
    setResultList(thisList);
    updateDisplayTable(thisList);
  }, [transformResult]);
  return (
    <div className="absolute w-full">
      <table className="border-none w-full table-fixed">
        <colgroup>
          <col style={{ width: contextColWidth }} />
          <col style={{ width: otherColWidth }} />
          <col style={{ width: otherColWidth }} />
        </colgroup>
        <thead>
          <tr>
            <th className={cellStyle}>Context</th>
            <th className={cellStyle}>Question</th>
            <th className={cellStyle}>Answer</th>
          </tr>
        </thead>
        <tbody>
          {resultList.map((rowData, index) => (
            <tr key={index}>
              {rowData.map((value, columnIndex) => (
                <td className={cellStyle} key={columnIndex}>
                  <div>{value}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QATable;
