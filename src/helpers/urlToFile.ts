export async function urlToFile(urls: Array<string>): Promise<FileList> {
    const asyncOperations: Array<Promise<Blob>> = [];
    const dt = new DataTransfer();

    for (let i=0; i<urls.length; i+=1) {
        asyncOperations.push(
            fetch(urls[i]).then(
                (result) => result.blob(), // result.blob() асинхронная
                (err) => {throw err}
            )
        );
    }

    const blobs = await Promise.all(asyncOperations);

    for (let i=0; i<blobs.length; i+=1) {
        const idx = urls[i].lastIndexOf('/') + 1;  // После последнего '/' идёи название файла (включая расширение)
        const fileName = urls[i].substring(idx);
        const blob = blobs[i];
        const file = new File([blob], `${fileName}`, {type: `${blob.type}`});
        dt.items.add(file);
    }

    return dt.files;
}