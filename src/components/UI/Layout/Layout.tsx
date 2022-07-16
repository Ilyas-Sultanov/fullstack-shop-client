import './Layout.scss';
import { Fragment, Suspense } from "react"; // Внимание! Suspense и lazy работают для любых компонентов, не только для страниц
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Notifications from "../Notifications/Notifications";
import CategoriesMenu from '../CategoriesMenu/CategoriesMenu';
import { adminRoutes, publicRoutes } from '../../../routes/routes';
import { RootState } from "../../../store/store";
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function Layout() {
    const notes = useSelector((state: RootState) => state.notifications);
    const authSate = useSelector((state: RootState) => state.auth);
    const categoriesMenuState = useSelector((state: RootState) => state.categoriesMenu);
    const location = useLocation();
    const routes = (authSate.isAuth && authSate.user?.roles.includes('admin')) ? 
        [...publicRoutes, ...adminRoutes] : publicRoutes 
    ;

    const isAdmin = location.pathname.includes('admin');

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
            <CategoriesMenu/>
        </Fragment>
    ) 
}

export default Layout;