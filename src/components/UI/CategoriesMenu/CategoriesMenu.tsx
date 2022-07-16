import './CategoriesMenu.scss';
import { useEffect, Fragment, memo, useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from "../../../store/store";
import { getCategories } from '../../../store/reducers/categoriesMenu/categoriesMenuActionCreators';
import MultilevelMenu, {IMultilevelMenu} from "../MultilevelMenu/MultilevelMenu";
import Spinner from "../Spninner/Spinner";
import { IResponseCategory } from "../../../types/CategoryTypes";
import { categoriesMenuActions } from '../../../store/reducers/categoriesMenu/categoriesMenu';
import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

function CategoriesMenu() {
    const portalElement = document.getElementById('overlays') as HTMLDivElement;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {categoriesMenuIsLoading, categoriesMenuIsInit, categories, isShowCategoriesMenu, selectedItem} = useSelector((state: RootState) => state.categoriesMenu);


    // useWhyDidYouUpdate('CategoriesMenu', {categoriesMenuIsLoading, categories, selectedItem});


    // useEffect(
    //     function() {
    //         if (location.pathname !== '/products') {
    //             setSelectedItem(undefined);
    //         }
    //     }, 
    //     [location.pathname]
    // );   


    const closeCategoriesMenu = useCallback(
        function(e: Event) {
            if (
                !(e.target as HTMLElement).closest('.categories-menu') && 
                !(e.target as HTMLElement).closest('.catalog-btn') // catalog-btn это кнопка в навигации, которая отрывает/закрывает CategoriesMenu
            ) 
            { 
                dispatch(categoriesMenuActions.setIsShowCategoriesMenu(false));
            }
        },
        [dispatch]
    );
 

    useEffect(() => {
        ['click', 'touchend'].forEach((eventName) => {
            document.addEventListener(eventName, (e) => closeCategoriesMenu(e));
        })
        return () => {
            ['click', 'touchend'].forEach((eventName) => {
                document.removeEventListener(eventName, (e) => closeCategoriesMenu(e));
            })
        };
    }, [closeCategoriesMenu]);


    useEffect(
        function() {
            dispatch(getCategories());
        },
        [dispatch]
    );


    const convertCat = useCallback( // конвертация данных (категорий) для MultilevelMenu.
        function(cat:IResponseCategory): IMultilevelMenu {
            return {
                name: cat.name,
                _id: cat._id,
                subMenus: cat.children.map((child) => {
                    return convertCat(child)
                })
            }
        },
        []
    );
   

    const getMenus = useCallback(
        function() {
            const menusArr: Array<IMultilevelMenu> = [];
            for (let i=0; i<categories.length; i+=1) {
                menusArr.push(convertCat(categories[i]));
            }
            return menusArr;
        },
        [categories, convertCat]
    );
  
    
    const menus = useMemo(
        function() {
            return getMenus();
        },
        [getMenus]
    );


    const findCategory = useCallback(
        function(categories: Array<IResponseCategory>, name: string): IResponseCategory | undefined {
            for (let i=0; i<categories.length; i+=1) {
                if (categories[i].name === name) return categories[i];
                else if (categories[i].children.length) {
                    return findCategory(categories[i].children, name);
                }
            }
        },
        []
    );
  

    const clickHandler = useCallback(
        function(selectedCat: IMultilevelMenu) {
            const category = findCategory(categories, selectedCat.name);
            if (category && category.status === 'leaf') {
                dispatch(categoriesMenuActions.setIsShowCategoriesMenu(false));
                dispatch(categoriesMenuActions.setSelectedItem(selectedCat));
                navigate('products', {state: category._id});
            }
        }, 
        [categories, findCategory, navigate, dispatch]
    );


    return (
        <Fragment>
            {
                createPortal(
                    <div className={`categories-menu bg-dark ${categoriesMenuIsInit ? 'no-animation' : isShowCategoriesMenu ? 'slide-right' : 'slide-left'}`}>
                        {
                            categoriesMenuIsLoading ? <Spinner/> : 
                            <MultilevelMenu
                                items={menus}
                                onClick={clickHandler}
                                selectedItem={selectedItem}
                            />
                        }
                    </div>, 
                    portalElement
                )
            }
       </Fragment>
    )
}

export default memo(CategoriesMenu);