import { useState } from "react"
import { fileTypeFromBlob } from 'file-type'
import exifr from 'exifr'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function App() {

  const [fileType, setFileType] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if(!selectedFile) return;

    const type = await fileTypeFromBlob(selectedFile)
    setFileType(type?.ext);

    try {
      const exifrData = await exifr.parse(selectedFile, true);

      setMetadata(exifrData);
      console.log(exifrData);
      setShowTable(true);
      console.log(Object.keys(exifrData));
    }
    catch(err){
      console.log("err parsing file");
      console.log(err);
    }

    
  }

  return (
    <>
      <div className="m-4 flex justify-center items-center gap-4">
        <input 
          type="file" 
          name="img" 
          onChange={handleFileChange}
          className="bg-zinc-400 cursor-pointer"
        />

        <div>
          {showTable && <div>File Type - {`${fileType}`}</div>}
        </div>
        
      </div>

      <div className="flex justify-center">
        <div className="max-w-xl">
          {showTable && 
            <Table>
              <TableCaption>All metadata</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-xl">Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {metadata && Object.entries(metadata).map(([key, value]) => (
                    <TableRow 
                      key={key}
                      className="hover:bg-zinc-200"
                    >
                      <TableCell>{String(key)}</TableCell>
                      <TableCell>{String(value)}</TableCell>
                    </TableRow>
                  ))
                  }
              </TableBody>
            </Table>
          }
        </div>
      </div>
    </>
    
  )
}

export default App
