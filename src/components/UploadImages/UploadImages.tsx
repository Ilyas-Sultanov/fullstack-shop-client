import './UploadImages.scss';
import { ChangeEvent, MouseEvent, useRef, useState, useMemo, useCallback } from 'react';
import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import { ReactComponent as CloseIcon } from '../../img/x-lg.svg';
import {bytesToSize} from '../../helpers/bytesToSize';
import useWhyDidYouUpdate from '../../hooks/useWhyDidYouUpdate';

interface UploadImagesProps {
    children?: never
    name: string
    label: string
    imageFiles?: FileList
    multiple?: boolean 
    maxFiles?: number
    onChange: (newFileList: FileList) => void
    onRemove: (newFileList: FileList) => void
}

function UploadImages({name, label, imageFiles, multiple, maxFiles, onChange, onRemove}: UploadImagesProps) {
    const input = useRef<null | HTMLInputElement>(null);
    const [maxFilesErrMessage, setMaxFilesErrMessage] = useState('');

    useWhyDidYouUpdate('UploadImages', {name, label, imageFiles, multiple, maxFiles, onChange, onRemove, maxFilesErrMessage});

    const imagesUrls = useMemo(
        function() {
            if (imageFiles) {
                const arr = Array.from(imageFiles);
                const urls = arr.map((img) => URL.createObjectURL(img)); //"blob:http://localhost:3000/aab7fd7f-fb7d-44fd-9017-2e06d7bd6e08"
                return urls;
            }
        },
        [imageFiles]
    );


    const clickHandler = useCallback(
        function(e: MouseEvent) {
            e.preventDefault();
            input.current?.click();
        },
        []
    );
   
        
    function changeHandler(e: ChangeEvent<HTMLInputElement>) { 
        if (e.target.files && e.target.files.length > 0) { // без этой проверки, если открыть окно добавления файлов и закрыть его не добавив ни одного файла - будет ошибка           
            let files = e.target.files;

            if (imageFiles && (multiple || maxFiles)) { // если есть старые файлы и input может добавлять много файлов за один раз, то прибавляем новые файлы к старым.
                /**
                 * При выборе новых файлов, если вдруг имя новых файлов совпадают с именами старых,
                 * то удаляем из старого FileList старые файлы с совпавшими именами.
                 */
                const newFiles = e.target.files;
                const newFilesNames = Array.from(e.target.files).map((file) => file.name);
                const oldFiles = Array.from(imageFiles).filter((file) => {
                    if (!newFilesNames.includes(file.name)) {
                        return true;
                    }
                    return false;
                });
                const allFiles = [...oldFiles, ...newFiles];

                if (maxFiles) { 
                    const valid = isFilesCountOk(allFiles.length, `The sum of old and new files will exceed the maximum allowable limit - ${maxFiles}`);
                    if (!valid) return;
                }

                const dt = new DataTransfer();
                for (let i=0; i<allFiles.length; i+=1) {
                    dt.items.add(allFiles[i])
                }
                files = dt.files;
            }
            onChange(files);
        }
    }

    function removeHandler(imageName: string) {
        if (input && input.current) {
            input.current.value = ''; // без этого, если удалить изображение и потом сразу его же попытаться добавить, оно не добавится
        }
        if (imageFiles) {
            const newfilesArr = Array.from(imageFiles).filter((img) => img.name !== imageName);
            const dt = new DataTransfer();
            for (let i=0; i<newfilesArr.length; i+=1) {
                dt.items.add(newfilesArr[i]);
            }
            onRemove(dt.files);
        }
    }


    function isFilesCountOk(filesCount: number, message: string) {
        if (filesCount > maxFiles!) {
            setMaxFilesErrMessage(message);
            return false;
        }
        else {
            if (maxFilesErrMessage) {
                setMaxFilesErrMessage('');
            }
            return true;
        }
    }
    
    
    return (
        <Card className='upload-images mb-2'>
            {
                maxFiles && imagesUrls ? 
                <span className='upload-images__title d-block mb-2'>{`${label} (${imagesUrls.length}/${maxFiles})`}</span> :
                <span className='upload-images__title d-block mb-2'>{`${label}`}</span>
            }
            
            <Button className='upload-images__btn btn-sm btn-secondary mb-2' type='button' onClick={clickHandler}>Select</Button>
            <input 
                className='upload-images__input'
                type="file" 
                name={name}
                accept="image/jpeg, image/jpg, image/png, image/webp"
                onChange={changeHandler}
                ref={input}
                multiple={multiple}
            />
            <div className='upload-images__previews mb-2'>
                {
                    imageFiles && imageFiles.length > 0 && imagesUrls && imagesUrls.length > 0 && Array.from(imageFiles).map((img, index) => {
                        return (
                            <div key={img.name} className='upload-images__preview preview'>
                                <img src={imagesUrls[index]} alt={img.name} />
                                <div className='preview__remove' onClick={() => removeHandler(img.name)}><CloseIcon /></div>
                                <div className='preview__info'>
                                    <div className='preview__name'>{img.name}</div>
                                    <div className='preview__size'>{bytesToSize(img.size)}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                maxFilesErrMessage ? 
                <div className='upload-images__info'>{maxFilesErrMessage}</div> : 
                null
            }
        </Card>       
    )
}

export default UploadImages;