import { useEffect, useRef, useState } from "react"
import { fileTypeFromBlob } from 'file-type'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {FilePlus2, FileText, File} from 'lucide-react'
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import ImageReader from "./components/ImageReader"
import PdfReader from "./components/PdfReader"
import AudioRenderer from "./components/AudioRenderer"

function App() {

  interface FileType {
    ext: string,
    mime: string
  }

  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<FileType | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragCounter, setDragCounter] = useState<number>(0);

  const hiddenFileInput = useRef(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if(!selectedFile) return;

    const type = await fileTypeFromBlob(selectedFile)
    console.log(type);
    setFileType(type ?? null);
    setFile(selectedFile);
  }

  async function handleReadButtonClick(){
    if (!file) return;
    setShowTable(true);
  }

  function handleChooseButtonClick() {
    if (hiddenFileInput.current) {
      (hiddenFileInput.current as HTMLInputElement).click();
    }
  }

  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
    };

    // Prevent default drag behaviors on document
    document.addEventListener('dragenter', preventDefault);
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('dragleave', preventDefault);
    document.addEventListener('drop', preventDefault);

    return () => {
      document.removeEventListener('dragenter', preventDefault);
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('dragleave', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    setIsDragging(false);
    setDragCounter(0);

    const droppedFile = e.dataTransfer.files?.[0];
    if(droppedFile && !showTable) {
      const type = await fileTypeFromBlob(droppedFile)
      console.log(type);
      setFileType(type ?? null);
      setFile(droppedFile);
    }
  }

  

  function handleDragEnter() {
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }

  function handleDragLeave() {
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }

  return (
    <div 
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className="min-h-screen"
    >

      {/* show top level background when dragging */}
      {(isDragging && !showTable) && 
        <div className="fixed inset-0 z-[9999] bg-foreground/70 pointer-events-none flex justify-center text-3xl text-card/70 " />
      }

      {showTable ||
        <div  
          className={`flex justify-center items-center min-h-screen bg-background`}
        >
          <Card
            className="w-full max-w-lg bg-card border-dashed border-4">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <FilePlus2 className="size-20"/>
              </div>
              <CardTitle>Drop your file here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {showTable || 
                <div className="flex justify-center">
                  <Button 
                    onClick={handleChooseButtonClick}
                    className="bg-zinc-700 cursor-pointer rounded-none"
                  >
                    <File /> Choose File
                  </Button>
                  <Input 
                    type="file"
                    name="img"
                    ref={hiddenFileInput}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                </div>
              }
              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
              )}
              <Button
                disabled={!file}
                onClick={handleReadButtonClick}
                className="w-full cursor-pointer"
              >
                Read
              </Button>
            </CardContent>
          </Card>
          
        </div>
      }


      {(showTable && fileType?.mime.startsWith('image') && file) && <ImageReader file={file!} fileType={fileType}/>}
      {(showTable && fileType?.mime.startsWith('application/pdf') && file) && <PdfReader file={file!} fileType={fileType}/>}
      {(showTable && fileType?.mime.startsWith('audio') && file) && <AudioRenderer file={file!} fileType={fileType}/>}

      
    </div>
    
  )
}

export default App
