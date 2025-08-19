import { useState } from "react";
import exifr from "exifr";
import {type propsType}from "@/utils/propsType";
import useAsyncEffect from 'use-async-effect'
import ViewMetaData from "./ui/viewMetadata";



export default function({ file, fileType }: propsType) {

  const [metadata, setMetadata] = useState<any>(null);

  useAsyncEffect(async () => {
    try {
        const exifrData = await exifr.parse(file, true);

        setMetadata(exifrData);
        console.log(exifrData);
        console.log(Object.keys(exifrData));
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
 
