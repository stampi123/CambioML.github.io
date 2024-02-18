'use client';

import useUserId from '../hooks/useUserId';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';
import { CloudArrowUp, FileX, DownloadSimple } from '@phosphor-icons/react';
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
let client_id: string = 'AAA';

<GoogleOAuthProvider clientId="864543610613-1s9pqj09cmmmoheteovakjpsug1cqeth.apps.googleusercontent.com">...</GoogleOAuthProvider>;

type ResultList = Array<[string, string, string]>;

const containerClasses = 'max-w-[2520px] mx-auto p-20 text-center flex flex-col justify-between';

const textContainerStyle: React.CSSProperties = {
  marginBottom: '20px', // Add margin at the bottom to separate the text from the table
};

const ProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 55vh; /* Adjust the height based on your requirement */
`;

const ProcessingSpinner = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DropzoneContainerClass =
  'border-2 bg-gray-100 border-dashed border-gray-300 h-[50vh] rounded-md m-20 text-center cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center hover:border-blue-500';

const TryAgainIcon = styled.div`
  cursor: pointer;
  color: #3498db;
  font-size: 24px;
  margin-top: 20px; /* Add margin for spacing */
`;

const iconContainerClasses = 'flex items-center justify-center text-3xl mb-4';

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
`;
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const GoogleLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const cellStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center',
};

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
};

interface TableProps {
  data: ResultList;
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div style={tableContainerStyle}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Context</th>
            <th style={cellStyle}>Question</th>
            <th style={cellStyle}>Answer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, index) => (
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

const FileUpload: React.FC = () => {
  // const client_id = useUserId();
  // console.log('client_id: ', client_id);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleTryAgainClick = () => {
    // Reload the page to start the file upload process again
    window.location.reload();
  };

  const [displayTable, setDisplayTable] = useState<ResultList | null>(null);

  const handleDownload = useCallback(() => {
    if (displayTable) {
      // Convert table data to CSV format and use url to download 
      const csvContent = displayTable.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
    
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  }, [displayTable]);

  const handleLogin = (response: any) => {
    console.log('Logged in successfully:', response);
    setLoggedIn(true); 
    // googleLogout();

    // const parsed_API: OAuth_Response
    // console.log('client-id: ', response.credential);
    let temp: string = response.credential;
    client_id = temp; 
    console.log('client_id at handle in: ', client_id);

    // const client_id = response.

    // setTimeout(() => {
    //   googleLogout();
    //   setLoggedIn(false);
    // }, 20 * 60 * 1000); // log out after 20 mins
  };

  console.log('client_id before onDrop: ', client_id);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setLoading(true);
    setLoggedIn(true);

    const resultList: ResultList = [];
    const uploadedFile = acceptedFiles[0];
    const file_name = uploadedFile.name;

    // Exception handling for big file and unsupported type
    if (uploadedFile) {
      const allowedTypes = ['application/pdf', 'text/html', 'text/plain'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setErrorMessage('File type is not supported. Please refresh the page and try again.');
        return;
      }
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds the limit of 10 MB. Please refresh the page and try again.');
        return;
      }
    }

    // New Design 
    console.log('client_id inside onDrop: ', client_id);
    const job_id: string = '1';
    const token_id: string = '111';


    const GetPresignedS3UrlAPI: string = `https://3vi3v75dh2.execute-api.us-west-2.amazonaws.com/v1/upload?token=${token_id}&client_id=${client_id}?file_name=${file_name}`;
    // const GetPresignedS3UrlAPI: string = `https://yc4onecxcf.execute-api.us-west-2.amazonaws.com/default/getPresignedS3Url?file_name=${file_name}&client_id=${client_id}`;

    const fetchData = async () => {
      const response = await axios.get<{ fields: Record<string, string>; url: string }>(GetPresignedS3UrlAPI);
      const data = response.data;

      console.log('GetPresignedS3UrlAPI: ', data);

      const postData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        postData.append(key, value);
      });

      postData.append('file', uploadedFile);

      try {
        const httpResponse = await axios.post(data.url, postData);
        if (httpResponse.status === 204) {
          setUploadingFile(false);
          setUploadedFiles(acceptedFiles);
          setSuccessMessage('File uploaded successfully!');
          setErrorMessage(null);
          setLoading(false);
        } else {
          setUploadingFile(false);
          setSuccessMessage(null);
          setErrorMessage('Error uploading file. Please refresh the page and try again.');
        }
      } catch (error) {
        setUploadingFile(false);
        setSuccessMessage(null);
        setErrorMessage('Error uploading file. Please refresh the page and try again.');
      }

      const backendFileName = data.fields.key;
      const GetJobStatusAPI: string = `https://1nqoh4mjxl.execute-api.us-west-2.amazonaws.com/default/getPlaygroundJobResult?job_id=${backendFileName}`;

      // Delay to make sure the file is uploaded to S3 so the job id found is not void
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // move processing
      const pollJobStatus = async () => {
        // Time out after 600 seconds
        const timeoutDuration = 600000;
        const startTime = Date.now();

        // eslint-disable-next-line no-constant-condition
        while (true) {
          try {
            const response = await axios.get(GetJobStatusAPI);
            console.log('Waiting:', response.status);

            if (Date.now() - startTime > timeoutDuration) {
              setCompleted(false);
              setUploadingFile(false);
              setSuccessMessage(null);
              setErrorMessage('Your request timed out. Please refresh the page and try again.');
              return;
            }
            // statuscode mapping
            // 200 means the job is done
            // 202 means the job is still running
            // 400 means the parameter is invalid
            // 404 means the job is not found
            // 500 means the job has failed
            if (response.status === 200) {
              const outputArray = response.data;
              if (outputArray && outputArray.length > 0) {
                for (let i = 0; i < outputArray.length; i++) {
                  const curOutput = outputArray[i]?.output;
                  if (curOutput && curOutput.length > 0) {
                    const responseArray = curOutput[0]?.response;
                    if (responseArray && responseArray.length > 0) {
                      for (let j = 0; j < responseArray.length; j++) {
                        const curAnswer = responseArray[j]?.answer;
                        const curContext = responseArray[j]?.context;
                        const curQuestion = responseArray[j]?.question;
                        resultList.push([curContext, curQuestion, curAnswer]);
                        console.log(
                          `Row ${i + 1}, Response ${j + 1}: Answer=${curAnswer}, Context=${curContext}, Question=${curQuestion}`
                        );
                      }
                    }
                  }
                }
                setCompleted(true);
                setDisplayTable(resultList);
              }
              break;
            } else if (response.status === 202) {
              // Wait for 5 seconds before making the next request
              await new Promise((resolve) => setTimeout(resolve, 5000));
            } else {
              break;
            }
          } catch (error) {
            break;
          }
        }
      };
      pollJobStatus();
    };
    setSuccessMessage('File uploading!');
    setUploadingFile(true);
    fetchData();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={containerClasses}>
      <div style={textContainerStyle}>
        <h1 className="font-bold text-2xl">Playground: Hassle-free Uniflow Experience!</h1>
      </div>

      {!loggedIn && (
        <GoogleLoginWrapper>
          <GoogleOAuthProvider clientId="864543610613-1s9pqj09cmmmoheteovakjpsug1cqeth.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={credentialResponse => {
                handleLogin(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              // useOneTap
            />
          </GoogleOAuthProvider>
        </GoogleLoginWrapper>
      )}

      {loggedIn && !loading && uploadedFiles.length === 0 && (
        <div className={DropzoneContainerClass} {...getRootProps()}>
          <div className={iconContainerClasses}>{<CloudArrowUp size={32} />}</div>
          <input {...getInputProps()} className="hidden" />
          <p className="mt-2">
            {isDragActive ? 'Drop files here' : 'Drag and drop a single file here, or click to select a file'}
          </p>
          <p className="text-sm text-gray-500">PDFs, HTMLs, and TXTs only</p>
          <p className="text-sm text-gray-500">Please do not upload any sensitive information.</p>
          <p className="text-sm text-gray-500">Max 10 MB</p>
        </div>
      )}
      {successMessage && !completed && !uploadingFile && (
        <div>
          <SuccessMessage>{successMessage}</SuccessMessage>
          <ProcessingContainer>
            <ProcessingSpinner />
            <p>Processing...</p>
          </ProcessingContainer>
        </div>
      )}
      {successMessage && uploadingFile && (
        <div>
          <SuccessMessage>{successMessage}</SuccessMessage>
          <ProcessingContainer>
            <ProcessingSpinner />
            <p>Processing...</p>
          </ProcessingContainer>
        </div>
      )}
      {errorMessage && !completed && (
        <div>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <div className="flex items-center h-[50vh] justify-center text-red-500">
            <FileX className="mr-2" size={72} />
          </div>
        </div>
      )}
      {completed && displayTable && (
        <div className="h-[60vh]">
          <div className="max-h-[50vh] overflow-y-auto">
            <Table data={displayTable} />
          </div>
          <TryAgainIcon onClick={handleTryAgainClick}>
            <p>
              <small>Upload another file</small>
            </p>
          </TryAgainIcon>

          {/* <button className="DownloadButton" onClick={handleDownload}>Download Table</button> */}

          <button className="DownloadButton" onClick={handleDownload}>
            {/* <DownloadSimple size={24} weight="fill" NEED TO BE CENTERED /> */}
            <span style={{ marginLeft: '5px' }}>Download Table</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default FileUpload;
