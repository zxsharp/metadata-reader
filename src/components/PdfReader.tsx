import { useState } from "react";
import { PDFDocument } from 'pdf-lib'

import {type propsType} from "@/utils/propsType";
import useAsyncEffect from 'use-async-effect'
import ViewMetaData from "./ui/viewMetadata";



export default function({ file, fileType }: propsType) {

  const [metadata, setMetadata] = useState<any>(null);

    useAsyncEffect(async () => {
    try {
        const pdfArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer, {
          updateMetadata: false
        })

        const pdfData = {
          Title: pdfDoc.getTitle(),
          Subject: pdfDoc.getSubject(),
          Author: pdfDoc.getAuthor(),
          Producer: pdfDoc.getProducer(),
          "Page Count": pdfDoc.getPageCount(),
          Pages: pdfDoc.getPages(),
          "Page Indices": pdfDoc.getPageIndices(),
          "Creation Date": pdfDoc.getCreationDate(), 
          "Modification Date": pdfDoc.getModificationDate(),
          Keywords: pdfDoc.getKeywords(),
          Form: pdfDoc.getForm(),
          Creator: pdfDoc.getCreator(),
        }

        setMetadata(pdfData);
        console.log(pdfData);
        console.log(Object.keys(pdfData));
    }
        catch(err){
        console.log("err parsing file");
        console.log(err);
    }
  }, []);
    
  return (
    <>
      {metadata && 
        <ViewMetaData file={file} fileType={fileType} metadata={metadata} />
      }
    </>
  )
}
 
