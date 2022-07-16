import './Categories.scss';
import {Suspense, lazy} from 'react';
import {Routes, Route, Link, useLocation} from 'react-router-dom';
const CategoriesList = lazy(() => import("./CategoriesList"));
const CreateCategory = lazy(() => import("./CreateCategory"));
const EditCategory = lazy(() => import("./EditCategory"));

function Categories() {
    const location = useLocation();
    // console.log(location.pathname);

    return (
        <div className="categories">
            {
                location.pathname === '/admin/categories' ? 
                <Link to="create" className="btn btn-primary btn-sm mb-2">Create root category</Link> : 
                ''
            }
            
            <div className="categories__content">
                <Routes>
                    <Route 
                        path='' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <CategoriesList/>
                            </Suspense>
                        } 
                    />
                    <Route 
                        path='create' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <CreateCategory/>
                            </Suspense>
                        }
                    /> 
                    <Route 
                        path='edit/:categoryId' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <EditCategory/>
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Categories;