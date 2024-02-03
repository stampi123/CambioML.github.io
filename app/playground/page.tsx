'use client';

import useUserId from '../hooks/useUserId';
import Container from '../components/Container';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { CloudArrowUp } from "@phosphor-icons/react";

const containerClasses = 'max-w-800 mx-auto p-20 text-center';

const containerStyle: React.CSSProperties = {
  maxWidth: '800px', // Set the maximum width for the container
  margin: '0 auto', // Center the container horizontally
  padding: '20px', // Add some padding to the container
  textAlign: 'center',
};

const textContainerStyle: React.CSSProperties = {
  marginBottom: '20px', // Add margin at the bottom to separate the text from the table
};

const ProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh; /* Adjust the height based on your requirement */
`;

const ProcessingSpinner = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #cccccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border 0.3s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #2185d0;
  }
`;

const TryAgainIcon = styled.div`
  cursor: pointer;
  color: #3498db;
  font-size: 24px;
  margin-top: 20px; /* Add margin for spacing */
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 10px;
`;

const iconContainerClasses = 'flex items-center justify-center text-3xl mb-4';

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;
const FileItem = styled.li`
  margin-bottom: 5px;
  font-size: 14px;
`;
const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
`;
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const cellStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center',
};

const itemStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
};

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
};

interface TableProps {
  data: any[][];
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
  const client_id: string = useUserId();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleTryAgainClick = () => {
    // Reload the page to start the file upload process again
    window.location.reload();
  };

  // Placeholder texts
  const [displayTable, setDisplayTable] = useState<any | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    setSuccessMessage(null);
    setErrorMessage(null);
    setLoading(true);


    // const formData = new FormData();
    // formData.append('file', acceptedFiles[0]);

    // final reponse table
    const resultList: any[][] = [];

    // get file name and file type
    const uploadedFile = acceptedFiles[0];
    const file_name = uploadedFile.name;
    console.log("file_name: ", file_name);
    // const client_id: string = useUserId();

    // This API needs two parameters: file_name and client_id
    const GetPresignedS3UrlAPI: string = `https://yc4onecxcf.execute-api.us-west-2.amazonaws.com/default/getPresignedS3Url?file_name=${file_name}&client_id=${client_id}`;
    
    const fetchData = async () => {
      try {
        const response = await axios.get<{ fields: Record<string, string>; url: string }>(GetPresignedS3UrlAPI);
    
        const data = response.data;

        console.log('Response:', data);
    
      } catch (error) {
        console.error('Error:');
        throw new Error('not good');
      }

      const response = await axios.get<{ fields: Record<string, string>; url: string }>(GetPresignedS3UrlAPI);
    
      const data = response.data;

      const postData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        postData.append(key, value);
      });

      postData.append('file', uploadedFile);

      try {
        const httpResponse = await axios.post(data.url, postData);

        console.log(httpResponse);

        // Handle the HTTP response as needed
        if (httpResponse.status === 204) {
          const responseData = httpResponse.data;
          // Handle the responseData
          console.log('POST Response:', responseData);
        } else {
          console.error('Upload to S3 - POST Error:', httpResponse.statusText);
        }
      } catch (error) {
        console.error('Upload to S3 - POST Axios error:');
      }

      const backendFileName = data.fields.key;
      console.log('backendFileName: ', backendFileName);
      const GetJobStatusAPI: string = `https://1nqoh4mjxl.execute-api.us-west-2.amazonaws.com/default/getPlaygroundJobResult?job_id=${backendFileName}`;

      // Delay 10 seconds to make sure the file is uploaded to S3 so the job id found is not void
      await new Promise(resolve => setTimeout(resolve, 10000));

      // move processing
      const pollJobStatus = async () => {

        // Time out after 120 seconds
        const timeoutDuration = 120000; 
        const startTime = Date.now();
        
        while (true) {
          try {
            const response = await axios.get(GetJobStatusAPI);
      
            console.log('Waiting:', response.status);

            if (Date.now() - startTime > timeoutDuration) {
              console.error('Timeout: Job status check exceeded 60 seconds.');
              // TODO: add another state for timeout
              break;
            }
      
            // 200 means the job is done
            // 202 means the job is still running
            // 400 means the parameter is invalid
            // 404 means the job is not found
            // 500 means the job has failed
            if (response.status === 200) {
              console.log(response.data);

              // Accessing 'output' property with nullish checks
              const outputArray = response.data;
              if (outputArray && outputArray.length > 0) {

                // Iterate through the array using a for loop
                for (let i = 0; i < outputArray.length; i++) {

                  // Access individual elements of the rowData
                  let curOutput = outputArray[i]?.output;

                  console.log('curOutput: ', curOutput);

                  if (curOutput && curOutput.length > 0) {
                    let responseArray = curOutput[0]?.response;

                    console.log('responseArray: ', responseArray);
              
                    if (responseArray && responseArray.length > 0) {
                      for (let j = 0; j < responseArray.length; j++) {
                        let curAnswer = responseArray[j]?.answer;
                        let curContext = responseArray[j]?.context;
                        let curQuestion = responseArray[j]?.question;

                        resultList.push([curContext, curQuestion, curAnswer]);
              
                        console.log(`Row ${i + 1}, Response ${j + 1}: Answer=${curAnswer}, Context=${curContext}, Question=${curQuestion}`);
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
              await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
              console.error('Error:', response.status);
              break;
            }
          } catch (error) {
            console.error('JobStatus: ', error);
            break;
          }
        }
        
      };

      pollJobStatus();


    };
    
    // Call the function to initiate the fetch
    fetchData();

    try {

      const condition = 200;

      if (condition === 200) {
        setUploadedFiles(acceptedFiles);
        setSuccessMessage('File uploaded successfully!');
        setErrorMessage(null);
        setLoading(false); // Set loading state to false
      } else {
        setSuccessMessage(null);
        setErrorMessage('Error uploading file.');
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage('Error uploading file.');
    }

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={containerClasses}>

      <div style={textContainerStyle}>
        <h1>Playground: Hassle-free Uniflow Experience!</h1>
      </div>

      {!loading && uploadedFiles.length === 0 && (
        <DropzoneContainer {...getRootProps()} className="bg-gray-100 p-4 border-dashed border-2 border-gray-300">
          <div className={iconContainerClasses}>
            {/* <FontAwesomeIcon icon={faCloudUploadAlt} size='1x' /> */}
            {<CloudArrowUp size={32} />}
          </div>

        <input {...getInputProps()} className="hidden" />
        <p className="mt-2">
          {isDragActive ? 'Drop files here' : 'Drag and drop a single file here, or click to select a file'}
        </p>
        <p className="text-sm text-gray-500">PDFs, HTMLs, and TXTs only</p>
        <p className="text-sm text-gray-500">Max 20 MB</p>
        </DropzoneContainer>
      )}

      {successMessage && !completed && (
        <div>
          <SuccessMessage>
            {successMessage}
          </SuccessMessage>

          <ProcessingContainer>
            <ProcessingSpinner/>
            <p>Processing...</p>
          </ProcessingContainer>
        </div>
      )}

      {errorMessage && !completed && <ErrorMessage>{errorMessage}</ErrorMessage>}

      {/* <FileList>
        {uploadedFiles.map((file, index) => (
          <FileItem key={index}>{file.name}</FileItem>
        ))}
      </FileList> */}
      
      {/* Only display reponse after complete API calls */}
      {completed && (
      <div>
        <Table data={displayTable} />

        <TryAgainIcon onClick={handleTryAgainClick}>
          {/* <FontAwesomeIcon icon={faRedo} /> */}
          <p><small>Upload another file</small></p>
        </TryAgainIcon>
      </div>
      )}

    </div>
  );
};

export default FileUpload;