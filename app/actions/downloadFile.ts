interface IParams {
  filename: string;
  fileContent: string;
  fileType: string;
  suffix: string;
}

export const getFileName = (filename: string) => {
  const lastDotIndex = filename?.lastIndexOf('.');
  const splitFilename = filename?.substring(0, lastDotIndex);
  return splitFilename;
};

export const downloadFile = ({ filename, fileContent, fileType, suffix }: IParams) => {
  const blob = new Blob([fileContent], { type: fileType });
  const url = URL.createObjectURL(blob);
  const splitFilename = getFileName(filename);

  const a = document.createElement('a');
  a.href = url;
  a.download = splitFilename + suffix;
  a.click();

  URL.revokeObjectURL(url);
};
