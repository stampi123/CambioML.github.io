import { useEffect, useState } from 'react';

interface KeyValueTableProps {
  keyValues: { [key: string]: string };
}

const cellStyle = 'p-2 text-center whitespace-pre-wrap break-words';

const KeyValueTable = ({ keyValues }: KeyValueTableProps) => {
  const [resultList, setResultList] = useState<string[][]>([]);
  useEffect(() => {
    const thisList: string[][] = [];
    for (const [key, value] of Object.entries(keyValues)) {
      thisList.push([key, value]);
    }
    setResultList(thisList);
  }, [keyValues]);
  return (
    <div className="absolute w-full">
      <table className="border-none w-full table-fixed">
        <colgroup>
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th className={cellStyle}>Key</th>
            <th className={cellStyle}>Value</th>
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

export default KeyValueTable;
