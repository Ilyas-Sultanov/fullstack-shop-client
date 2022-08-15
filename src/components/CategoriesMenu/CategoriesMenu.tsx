import './CategoriesMenu.scss';
import { useEffect, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { getCategories } from '../../store/reducers/categoriesMenu/categoriesMenuActionCreators';
import MultilevelMenu from "../UI/MultilevelMenu/MultilevelMenu";
import {IMultilevelMenu} from '../UI/MultilevelMenu/Menu';
import Spinner from "../UI/Spninner/Spinner";
import Button from '../UI/Button/Button';
import { IResponseCategory } from "../../types/CategoryTypes";
import { ReactComponent as CloseIcon } from '../../img/x-lg.svg';
import { RootState } from '../../store/store';
import useLocalStorage from '../../hooks/useLocalStorage';
// import useWhyDidYouUpdate from '../../hooks/useWhyDidYouUpdate';

type CategoriesMenuProps = {
    className: string
    onClick: (category: IResponseCategory) => void
    onHide: () => void
}

function CategoriesMenu ({ onClick, onHide, className }: CategoriesMenuProps) {
    const dispatch = useDispatch();
    const location = useLocation();
    const { categories, categoriesMenuIsLoading } = useSelector((state: RootState) => state.categoriesMenu);
    const [selectedCategory, setSelectedCategory] = useLocalStorage<IResponseCategory>('selectedCategory');

    // useWhyDidYouUpdate('CategoriesMenu', {onClick, onHide, className, categories, categoriesMenuIsLoading, selectedCategory});
   

    useEffect(
        function() {
            dispatch(getCategories());
        },
        [dispatch]
    );


    useEffect(
        // При смене страницы, удаляем selectedCategory, так не будет выделяться категрия в CategoriesMenu, ведь мы больше не на странице Products. 
        function() {
            if (!/^\/products/.test(location.pathname)) {
                setSelectedCategory(undefined);
            }
        },
        [location, setSelectedCategory]
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
        function(selectedCat: IMultilevelMenu<IResponseCategory>) {
            const category = findCategory(categories, selectedCat.name);
            if (category && category.status === 'leaf') {
                onClick(selectedCat as IResponseCategory);
                setSelectedCategory(selectedCat as IResponseCategory);
            }
        }, 
        [categories, setSelectedCategory, findCategory, onClick]
    );


    return (
        <div className={className}>
            <Button className='category-menu__close-btn' onClick={onHide}><CloseIcon/></Button>
            {
                categoriesMenuIsLoading ? <Spinner/> : 
                <MultilevelMenu
                    items={categories}
                    onClick={clickHandler}
                    selectedItem={selectedCategory ? {name: selectedCategory.name, _id: selectedCategory._id, children: []} : undefined}
                />
            }
        </div>
    )
}


export default memo(CategoriesMenu);