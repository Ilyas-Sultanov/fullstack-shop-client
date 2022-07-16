import { lazy } from 'react';
const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const ResetPassword = lazy(() => import("../pages/ResetPassword/ResetPassword"));
const Admin = lazy(() => import("../pages/Admin/Admin"));
const Contacts = lazy(() => import("../pages/Contacts/Contacts"));
const Products = lazy(() => import("../pages/Products/Products"));
const Error = lazy(() => import("../pages/Error/Error"));

const publicRoutes = [
    { path: '', element: Home },
    { path: 'resetPassword/:link', element: ResetPassword },
    { path: 'about', element: About },
    { path: 'contacts', element: Contacts },
    { path: 'products', element: Products }, // звездочка нужна для того чтобы отличать вложенные роуты от родительского, если есть вложенные роуты, то * обязательна
    { path: 'error', element: Error },
];

// const privateRoutes = [
//     { path: 'somePrivate', element: Profile },
// ];

const adminRoutes = [
    { path: 'admin/*', element: Admin }, // звездочка нужна для того чтобы отличать вложенные роуты от родительского, если есть вложенные роуты, то * обязательна
];

export {
    publicRoutes,
    // privateRoutes,
    adminRoutes
};