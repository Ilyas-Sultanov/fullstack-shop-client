import './Layout.scss';
import { Fragment, Suspense, useCallback } from "react"; // Внимание! Suspense и lazy работают для любых компонентов, не только для страниц
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Notifications from "../UI/Notifications/Notifications";
import CategoriesMenu from '../CategoriesMenu/CategoriesMenu';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import { categoriesMenuActions } from '../../store/reducers/categoriesMenu/categoriesMenu';
import { adminRoutes, publicRoutes } from '../../routes/routes';
import { IResponseCategory } from '../../types/CategoryTypes';


function Layout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notes = useSelector((state: RootState) => state.notifications);
    const authSate = useSelector((state: RootState) => state.auth);
    const { isShowCart } = useSelector((state: RootState) => state.shoppingCart);
    const { isShowCategoriesMenu } = useSelector((state: RootState) => state.categoriesMenu);
    const location = useLocation();
    const routes = (authSate.isAuth && authSate.user?.roles.includes('admin')) ? 
        [...publicRoutes, ...adminRoutes] : publicRoutes 
    ;

    const isAdmin = location.pathname.includes('admin');

    const categoryMenuClickHandler = useCallback(
        function(category: IResponseCategory) {
            dispatch(categoriesMenuActions.setIsShowCategoriesMenu(false));
            navigate(`products?page=1&category=${category._id}`);
        },
        [navigate, dispatch]
    );

    const hideCategoriesMenu = useCallback(
        function() {
            dispatch(categoriesMenuActions.setIsShowCategoriesMenu(false));
        },
        [dispatch]
    );

    return (
        <Fragment>
            <Header/>
            <main className='main'>
                {
                    !authSate.isLoading ? 
                    /* 
                        При инициализации, isLoading === true, после проверки авторизации, 
                        значение меняется на false, и в это время уже известно какие роуты доступны,
                        таким образом не будет рендерится страница с ошибкой при перезагрузке приватных и админских страниц
                    */
                    <Routes>
                        {
                            routes.map((route) => 
                                <Route 
                                    key={ route.path }
                                    path={ `${route.path}` } 
                                    element={ 
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <route.element />
                                        </Suspense>
                                    }
                                />
                            )
                        }
                        <Route path="*" element={<Navigate to="error" replace/>} /> {/* звездочка означает - любой другой путь */}
                    </Routes> :
                    <p>Loading...</p>
                }
            </main>

            {!isAdmin && <Footer/>}
            {notes.length > 0 && <Notifications />}

            <CSSTransition
                in={isShowCategoriesMenu} // то что тригерит анимацию
                timeout={300}
                classNames={{
                    // appear: '',
                    // appearActive: '',
                    // appearDone: '',
                    // enter: '',
                    enterActive: 'slide-right',
                    enterDone: 'show',
                    // exit: '',
                    exitActive: 'slide-left',
                    exitDone: '', // удаление класса анимации
                }}
                // onEnter={() => console.log('onEnter')}
                // onEntering={() => console.log('onEntering')}
                // onEntered={() => console.log('onEntered')}
                // onExit={() => console.log('onExit')}
                // onExiting={() => console.log('onExiting')}
                // onExited={() => console.log('onExited')}
            >
                <CategoriesMenu 
                    className='bg-dark categories-menu'
                    // selectedCat={selectedCat}
                    onClick={categoryMenuClickHandler}
                    onHide={hideCategoriesMenu}
                />
            </CSSTransition>

            <CSSTransition
                in={isShowCart} 
                timeout={300}
                classNames={{
                    enterActive: 'slide-left',
                    enterDone: 'show',
                    exitActive: 'slide-right',
                    exitDone: '', 
                }}
            >
                <ShoppingCart />
            </CSSTransition>
        </Fragment>
    ) 
}

export default Layout;