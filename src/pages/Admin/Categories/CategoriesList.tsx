import { useEffect, useState, Fragment, MouseEvent, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryServices from '../../../services/CategoryServices';
import { IResponseCategory, IUICategory } from '../../../types/CategoryTypes';
import { notificationActions } from '../../../store/reducers/notifications';
import TreeList from '../../../components/UI/TreeList/TreeList';
import Trees from '../../../helpers/Trees';
import Spinner from '../../../components/UI/Spninner/Spinner';
import CategoriesContextMenu from './CategoryContextMenu';
import { AxiosError } from 'axios';

function CategoriesList() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<IResponseCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isShow, setIsShow] = useState(false);
    const [coordinats, setCoordinats] = useState({x: 0, y: 0});
    const [categoryForContextMenu, setCategoryForContextMenu] = useState({_id: '', status: ''});

    const getCategories = useCallback(
        async function getCategories() {
            try {
                const response = await CategoryServices.getAll();
                const cats = response.data;
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
        [dispatch]
    );
  

    useEffect(() => {
        getCategories();
    },[getCategories]);

    
    const memoizedCategories = useMemo(() => {
        return categories;
    }, [categories]);


    const hideContextMenu = useCallback(
        function() {
            setIsShow(false);
        }, 
        []
    );
  


    useEffect(() => {
        window.addEventListener('click', hideContextMenu);
        window.addEventListener('contextmenu', hideContextMenu);
        return () => {
            window.removeEventListener('click', hideContextMenu);
            window.removeEventListener('contextmenu', hideContextMenu);
        }
    }, [hideContextMenu]);


    const showContextMenu = useCallback((e: MouseEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const tree = Trees.findTree(nodeId, memoizedCategories) as IUICategory;
        const x = e.pageX + 110 > window.innerWidth ? window.innerWidth - 125 : e.pageX;
        const y = e.pageY + 124 > window.innerHeight ? window.innerHeight - 139 : e.pageY;
        setCoordinats({x, y});
        setCategoryForContextMenu({_id: tree._id, status: tree.status});
        setIsShow(true);
    }, [memoizedCategories]);


    const addChildBtnHandler = useCallback(
        function addChildBtnHandler(categoryId: string) {
            navigate(`${location.pathname}/create`, {replace: false, state: categoryId});
        },
        [location, navigate]
    );

    
    const deleteCategoryBtnHandler = useCallback(
        async function(categoryId: string) {
            try {
                setIsLoading(true);
                await CategoryServices.delete(categoryId);
                await getCategories();
            }
            catch (err) {
                const e = err as AxiosError<{message: string}>;
                dispatch(notificationActions.add({type: 'error', message: `${e.response?.data.message}`}));
            }
            finally {
                setIsLoading(false);
            }
        },
        [dispatch, getCategories]
    );

    
    const editCategoryBtnHandler = useCallback(
        function(categoryId: string) {
            navigate(`${location.pathname}/edit/${categoryId}`);
        }, 
        [location, navigate]
    );

  
    const actionButtons = useMemo(
        function() {
            const btns = [
                {label: 'Add child', func: addChildBtnHandler},
                {label: 'Edit', func: editCategoryBtnHandler},
                {label: 'Delete', func: deleteCategoryBtnHandler},
            ]
    
            if (categoryForContextMenu?.status === 'leaf') delete btns[0];
            return btns;
        },
        [addChildBtnHandler, editCategoryBtnHandler, deleteCategoryBtnHandler, categoryForContextMenu]
    );
      

    return (
        isLoading ? 
        <Spinner/> :
        memoizedCategories.length > 0 ?
        <Fragment>
            <TreeList 
                data={memoizedCategories} 
                onContextMenu={showContextMenu}
            />
            {
                isShow ? 
                <CategoriesContextMenu 
                    coordinats={coordinats}
                    nodeId={categoryForContextMenu._id}
                    actionButtons={actionButtons}
                /> : 
                null
            }
        </Fragment> :
        <div>Categories not found</div>
    )
}

export default CategoriesList;