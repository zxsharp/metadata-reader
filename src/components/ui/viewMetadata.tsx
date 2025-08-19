import {
  Table,
  TableBody,
  TableCell,    
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ViewMetaDataType } from "@/utils/propsType";

export default function ViewMetaData({file, fileType, metadata}: ViewMetaDataType) {
    return (
        <>
          <div className="m-4 flex justify-center text-2xl font-semibold">
            File Name: {`${file?.name}`}
          </div>
              <div className="m-4 flex justify-center text-2xl font-semibold">
              File Type: {`${fileType?.ext}`}
          </div>

          <div className="flex justify-center">
            <div className="max-w-xl">
              <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead className="w-xl">Key</TableHead>
                    <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                    {metadata && Object.entries(metadata)
                      .filter(([_, value]) => {
                        // Exclude empty values and non-renderable types (functions, objects except Date)
                        if (value === undefined || value === null || value === "") return false;
                        if (typeof value === "function") return false;
                        if (typeof value === "object" && !(value instanceof Date)) return false;
                        return true;
                      })
                      .map(([key, value]) => (
                        <TableRow key={key} className="hover:bg-zinc-200">
                          <TableCell>{String(key)}</TableCell>
                          <TableCell>{String(value)}</TableCell>
                        </TableRow>
                      ))
                    }
                </TableBody>
              </Table>
            
            </div>
          </div>
        </>
    )
}