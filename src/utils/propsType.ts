interface propsType {
    file: File,
    fileType: {
        ext ?: string
        mime ?: string
    }
}

interface ViewMetaDataType {
    file: File,
    fileType: {
        ext ?: string
        mime ?: string
    },
    metadata: {[key: string]: any}
}

export type {propsType, ViewMetaDataType}