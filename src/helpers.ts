import fs from 'fs';
import { getArgumentValue } from "./arguments";

export const getCoveragePath = (path: string): string => {
    let coveragePath: string = path;
    const argPath = getArgumentValue('coverageDir');
  
    if (argPath) {
      coveragePath = `${argPath}/coverage-summary.json`;
    }
  
    return coveragePath;
  };

  export const getReadmePath = (path: string): string => {
    let readmePath: string = path;
    const argPath = getArgumentValue('readmeDir');
  
    if (argPath) {
        readmePath = `${argPath}/README.md`;
    }
  
    return readmePath;
  };

  export const readFileAsync = async (path: string, encode: string): Promise<string> => {
      return new Promise((resolve, reject) =>{
          fs.readFile(path, encode, (err, data) => {
              if (err) reject()
              resolve(data)
          } )
      })
  }