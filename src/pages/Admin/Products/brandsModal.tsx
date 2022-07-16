import './BrandsModal.scss';
import { useState, useCallback, ChangeEvent, FocusEvent } from 'react';
import { DBBrand } from '../../../types/Brand';
import { ReactComponent as CreateIcon } from '../../../img/plus-square.svg';
import { ReactComponent as EditIcon } from '../../../img/pencil-square.svg';
import { ReactComponent as DeleteIcon } from '../../../img/trash.svg';
import Spinner from '../../../components/UI/Spninner/Spinner';
import Modal from '../.././../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import SelectWithSearch, { ISelectOption } from '../../../components/UI/SelectWithSearch/SelectWithSearch';

type BrandsModalProps = {
    isLoading: boolean
    brands: DBBrand[]
    onCreateBrand: (name: string) => void
    onEditBrand: (name: string, brandId: string) => void
    onDeleteBrand: (brandId: string) => void
    onBackdropClick: () => void
}

type BrandsModalInputsType = {value: string, isDirty: boolean, messages: Array<string>};

function BrandsModal({isLoading, brands, onCreateBrand, onEditBrand, onDeleteBrand, onBackdropClick}: BrandsModalProps) {
    const [selectedBrand, setSelectedBrand] = useState<DBBrand>();
    const [createInput, setCreateInput] = useState<BrandsModalInputsType>({value: '', isDirty: false, messages: []});
    const [editInput, setEditInput] = useState<BrandsModalInputsType>({value: '', isDirty: false, messages: []});
  
    const selectBrand = useCallback(
        function(selectedOption?: ISelectOption) {
            if (selectedOption) {
                const selBrand = brands.find((brand) => brand._id === selectedOption['_id']);
                setSelectedBrand(selBrand);
                setEditInput({...editInput, value: String(selBrand?.name)})
            }
            else {
                setSelectedBrand(undefined);
                setEditInput({value: '', isDirty: false, messages: []})
            }
        },
        [editInput, brands]
    );


    const validateInputValue = useCallback(
        function(value: string): Array<string> {
            const messages: Array<string> = [];
            if (value.length < 2) messages.push('Min length 2');
            if (value.length > 30) messages.push('Max length 30');
            return messages;
        },
        []
    );


    const createInputChangeHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const value = e.target.value;
            const messages = validateInputValue(value);
            setCreateInput((prev) => {
                return {...prev, value, messages};
            })
        },
        [validateInputValue]
    );


    const editInputChangeHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const value = e.target.value;
            const messages = validateInputValue(value);
            setEditInput((prev) => {
                return {...prev, value, messages};
            })
        },
        [validateInputValue]
    );


    const createInputBlurHandler = useCallback(
        function(e: FocusEvent<HTMLInputElement>) {
            setCreateInput((prev) => {
                return {...prev, isDirty: true};
            })
        },
        []
    );


    const editInputBlurHandler = useCallback(
        function(e: FocusEvent<HTMLInputElement>) {
            setEditInput((prev) => {
                return {...prev, isDirty: true};
            })
        },
        []
    );


    const createBrandHandler = useCallback(
        function() {
            onCreateBrand(createInput.value);
            setCreateInput({value: '', isDirty: false, messages: []});
        }, 
        [createInput.value, onCreateBrand]
    );


    const editBrandHandler = useCallback(
        function() {
            if (selectedBrand) onEditBrand(editInput.value, selectedBrand._id);
            setEditInput({value: '', isDirty: false, messages: []});
            setSelectedBrand(undefined);
        }, 
        [editInput.value, selectedBrand, onEditBrand]
    );


    const deleteBrandHandler = useCallback(
        function() {
            if (selectedBrand) onDeleteBrand(selectedBrand._id);
            setEditInput({value: '', isDirty: false, messages: []});
            setSelectedBrand(undefined);
        }, 
        [selectedBrand, onDeleteBrand]
    );


    return (
        <Modal
            className='brands-modal'
            onBackdropClick={() => {}}
        >
            {
                isLoading ? 
                <Spinner/> :
                <>
                    <div className='wrapper'>
                        <Input 
                            className={`${createInput.isDirty && createInput.messages.length > 0 ? 'mb-0' : 'mb-2'}`}
                            name='createInput'
                            onChange={createInputChangeHandler}
                            onBlur={createInputBlurHandler}
                            value={createInput.value}
                            messages={createInput.isDirty ? createInput.messages : []}
                            placeholder='New brand'
                        />
                        <Button 
                            className={`btn-sm btn-success ms-2`}
                            onClick={createBrandHandler}
                            disabled={createInput.messages.length > 0}
                        >
                            <CreateIcon/>
                        </Button>
                    </div>
                    <div className='wrapper'>
                        <SelectWithSearch
                            idKey='_id'
                            labelKey='name'
                            placeholder='Select brand'
                            onChange={selectBrand}
                            options={brands}
                            selectedOption={selectedBrand} // value
                        />
                        <Button 
                            className='btn-sm btn-danger ms-2'
                            onClick={deleteBrandHandler}
                            disabled={!selectedBrand}
                        >
                            <DeleteIcon/>
                        </Button>
                    </div>
         
                    <div className='wrapper'>
                        <Input
                            className='mt-2'
                            disabled={!selectedBrand && true}
                            name='editInput'
                            onChange={editInputChangeHandler}
                            onBlur={editInputBlurHandler}
                            value={editInput.value}
                            messages={editInput.isDirty ? editInput.messages : []}
                            placeholder='New name'
                        />
                        <Button 
                            className='btn-sm btn-warning ms-2 mt-2'
                            onClick={editBrandHandler}
                            disabled={(editInput.messages.length > 0) || !selectedBrand}
                        >
                            <EditIcon/>
                        </Button>
                    </div>
         
                    <Button 
                        className='btn-sm btn-primary mt-2 ms-auto d-block'
                        onClick={onBackdropClick}
                    >
                            Close
                    </Button>
                </>
            }
        </Modal>
    )
}

export default BrandsModal;