import { useEffect, useState } from 'react';
import { TransformResult, OutputItem } from '../../types/PlaygroundTypes';
import Markdown from 'react-markdown';

interface QATableProps {
  transformResult: TransformResult;
  updateDisplayTable: (resultList: string[][]) => void;
}

const cellStyle: React.CSSProperties = {
  padding: '8px',
  textAlign: 'center',
};

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
    <div className="absolute">
      <table className="border-none">
        <thead>
          <tr>
            <th style={cellStyle}>Context</th>
            <th style={cellStyle}>Question</th>
            <th style={cellStyle}>Answer</th>
          </tr>
        </thead>
        <tbody>
          {resultList.map((rowData, index) => (
            <tr key={index}>
              {rowData.map((value, columnIndex) => (
                <td key={columnIndex} style={cellStyle}>
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
