import {useEffect, useState, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import Spinner from '../../../components/UI/Spninner/Spinner';
import CategoryServices from '../../../services/CategoryServices';
import Modal from '../../../components/UI/Modal/Modal';
import TreeList, { TreeDataElement } from "../../../components/UI/TreeList/TreeList";
import { notificationActions } from '../../../store/reducers/notifications';
import { IResponseCategory, IUICategory, CategoryStatusType } from '../../../types/CategoryTypes';
import { AxiosError } from 'axios';

type CategoriesListModalProps = {
    hideModal: () => void
    checkbox?: boolean
    checkedCategoryId?: string | null
    currentCategoryId?: string
    multipleChecked?: boolean
    statuses?: CategoryStatusType[] // статусы категорий, для которых показывать чекбокс !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    onCheck: (category: IUICategory) => void
    children?: never
}

function CategoriesListModal({hideModal, onCheck, checkbox, checkedCategoryId, currentCategoryId, statuses, multipleChecked}: CategoriesListModalProps) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<IResponseCategory[] | IUICategory[]>([]);


    const addUIFields = useCallback(
        function(cats: IResponseCategory[]) {
            let categories: IUICategory[] = [];
            for (let i=0; i<cats.length; i+=1) {
                categories = cats.map((item, index) => {
                    return {
                        ...item,
                        checkbox: (statuses?.includes(cats[index].status) && cats[index]._id !== currentCategoryId) ? true : false,
                        children: cats[index].children && cats[index].children.length > 0 ? addUIFields(cats[index].children) : []
                    }
                });
            }
            return categories;
        }, 
        [currentCategoryId, statuses]
    );
    
    
    const getCategories = useCallback(
        async function() {
            try {
                const response = await CategoryServices.getAll();
                let cats = response.data;
                if (checkbox) {
                    cats = addUIFields(cats);
                }
                setCategories(cats);
            }
            catch (err) {
                const error = err as AxiosError;
                dispatch(notificationActions.add({type: 'error', message: error.response?.data}))
            }
            finally {
                setIsLoading(false);
            }
        }, 
        [dispatch, addUIFields, checkbox]
    );
    

    useEffect(() => {
        getCategories();
    },[getCategories]);

    
    // const memoizedCategories = useMemo(() => {
    //     return categories;
    // }, [categories]);
    

    const checkHandler = useCallback((node: TreeDataElement) => {
        checkCategories(categories);

        function checkCategories(cats: IUICategory[]) {
            for (let i=0; i<cats.length; i+=1) {
                if (cats[i]._id === node._id) {
                    if (onCheck) onCheck(node as IUICategory)
                    break;
                }
                else { 
                    if (cats[i].children && cats[i].children.length > 0) {
                        for (let j=0; j<cats[i].children.length; j+=1) {
                            checkCategories(cats[i].children);
                        }
                    }
                }
            }
        }
    }, [categories, onCheck]);


    return (
        <Modal className='category-list-modal' onBackdropClick={hideModal}>
            {
                isLoading ?
                <Spinner/> :
                categories.length > 0 ?
                <TreeList 
                    data={categories} 
                    onCheck={checkHandler}
                    idOfCheckedNode={checkedCategoryId}
                /> : 
                <div>Categories not found</div>
            }
        </Modal>
    )
}

export default CategoriesListModal;