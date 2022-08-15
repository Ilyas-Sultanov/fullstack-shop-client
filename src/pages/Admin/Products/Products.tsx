import './Products.scss';
import { Suspense, lazy } from 'react';
import {Routes, Route, Link, useLocation} from 'react-router-dom';
const ProductsTable = lazy(() => import('./ProductsTable'));
const CreateProduct = lazy(() => import('./CreateProduct'));
const EditProduct = lazy(() => import('./EditProduct'));

function Products() {
    const location = useLocation();

    return (
        <div className="admin-products">
            {
                location.pathname === '/admin/products' ? 
                <Link to="create" className="btn btn-primary btn-sm mb-2 align-self-start">Create product</Link> : 
                ''
            }
            
            <div className="products__content">
                <Routes>
                    <Route 
                        path='' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <ProductsTable/>
                            </Suspense>
                    }
                    />
                    <Route 
                        path='create' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <CreateProduct/>
                            </Suspense>
                        }
                    /> 
                    <Route 
                        path='edit/:productId' 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <EditProduct/>
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Products;