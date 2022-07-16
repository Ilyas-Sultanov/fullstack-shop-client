import { FC, Suspense, lazy } from "react";
import './Admin.scss';
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
const Users = lazy(() => import("./Users/Users"));
const Categories = lazy(() => import("./Categories/Categories"));
const Products = lazy(() => import("./Products/Products"));

const Admin: FC = () => {
    return (
        <div className="adminContainer">
            <Sidebar/>
            <div className="adminContent">
                <Routes>
                    <Route 
                        path="users" 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Users />
                            </Suspense>
                        }
                    />
                    <Route 
                        path="categories/*" 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Categories />
                            </Suspense>
                        }
                    />
                    <Route 
                        path="products/*" 
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Products />
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Admin;
