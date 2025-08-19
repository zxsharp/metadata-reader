import { useState } from "react";
import { parseBlob } from 'music-metadata'
import {type propsType} from "@/utils/propsType";
import useAsyncEffect from 'use-async-effect'
import ViewMetaData from "./ui/viewMetadata";



export default function({ file, fileType }: propsType) {

  const [metadata, setMetadata] = useState<any>(null);

    useAsyncEffect(async () => {
    try {
        const rawData = await parseBlob(file);
        let data: any = rawData.common;
        data = {...data, ...rawData.format};
        data = {...data, ...rawData.native};
        data = {...data, ...rawData.quality};

        setMetadata(data);
        console.log(data);
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
 
