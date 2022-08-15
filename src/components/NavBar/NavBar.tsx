import { useCallback, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './NavBar.scss';
import { ReactComponent as AuthIcon } from '../../img/box-arrow-in-right.svg';
import { ReactComponent as CartIcon } from '../../img/cart4.svg';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { authActions } from '../../store/reducers/auth/auth';
import AuthModal from '../AuthModal/AuthModal';
import Button from "../UI/Button/Button";
import { fetchLogOut } from '../../store/reducers/auth/authActionCreators';
import { notificationActions } from "../../store/reducers/notifications";
import { shoppingCartActions } from '../../store/reducers/shoppingCart/shoppingCart';
import { categoriesMenuActions } from '../../store/reducers/categoriesMenu/categoriesMenu';

function NavBar() {
    const [navMenuIsCollapsed, setNavMenuIsCollapsed] = useState(true);
    const catMenuTogglerBtn = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuth, isShowAuthModal } = useSelector((state: RootState) => state.auth);
    const { isShowCategoriesMenu } = useSelector((state: RootState) => state.categoriesMenu);
    const { shoppingCartItems, totalCount, isShowCart } = useSelector((state: RootState) => state.shoppingCart);
       
    const navbarToggleHandler = useCallback(
        function() {
            setNavMenuIsCollapsed(!navMenuIsCollapsed);
        },
        [navMenuIsCollapsed]
    );

    const navLinkClickHandler = useCallback(
        function() {
            setNavMenuIsCollapsed(true);
        },
        []
    );

    const showAuthModal = useCallback(
        function() {
            dispatch(authActions.setIsShowAuthModal(true));
        },
        [dispatch]
    ); 

    const authBtnHandler = useCallback(
        function() {
            if (navMenuIsCollapsed) {
                setNavMenuIsCollapsed(false);
            }
            showAuthModal();
        },
        [showAuthModal, navMenuIsCollapsed]
    );

    const logOut = useCallback(
        function() {
            dispatch(fetchLogOut());
            dispatch(notificationActions.add({type: 'success', message: 'You have successfully logged out'}));
            navigate('/')
        },
        [dispatch, navigate]
    );

    
    const adminBtnClickhandler = useCallback(
        function() {
            navigate('/admin');
            navLinkClickHandler();
        },
        [navigate, navLinkClickHandler]
    );


    const toggleCategoriesMenu = useCallback(
        function() {
            setNavMenuIsCollapsed(true);
            dispatch(categoriesMenuActions.setIsShowCategoriesMenu(!isShowCategoriesMenu));
        },
        [isShowCategoriesMenu, dispatch]
    );

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark header__navbar">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="" onClick={navLinkClickHandler}>LOGO</NavLink>
                <button 
                    className={`navbar-toggler ${navMenuIsCollapsed ? "collapsed" : ""}`}
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded={navMenuIsCollapsed ? false : true} 
                    aria-label="Toggle navigation"
                    onClick={navbarToggleHandler}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse bg-dark ${navMenuIsCollapsed ? "" : "show"}`} id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Button className="catalog-btn" onClick={toggleCategoriesMenu} ref={catMenuTogglerBtn}>Catalog</Button>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about" onClick={navLinkClickHandler}>About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contacts" onClick={navLinkClickHandler}>Contacts</NavLink>
                        </li>
                    </ul>

                    

                    <div className="navbar-buttons">
                        {
                            shoppingCartItems.length > 0 ?
                            <Button 
                                className="cart-btn"
                                onClick={() => dispatch(shoppingCartActions.setIsShowShoppingCart(!isShowCart))}
                            >
                                <CartIcon/>
                                <div className="cart-total">{totalCount}</div>
                            </Button> :
                            null
                        }
                       

                        {   
                            !isAuth ?
                            <Button 
                                className={`auth-btn`}
                                onClick={authBtnHandler}
                            >
                                <AuthIcon className="auth-icon"></AuthIcon>
                            </Button> :
                            <div className="btn-group">
                                <Button className={`btn-primary dropdown-toggle user-btn`}>{user?.name}</Button>
                                <ul className={`dropdown-menu dropdown-menu-dark`}>
                                    <li><Button className="dropdown-item">Profile</Button></li>
                                    {
                                        user?.roles.includes('admin') ? 
                                        <li>
                                            <Button className="dropdown-item" onClick={adminBtnClickhandler}>
                                                Admin Panel
                                                </Button>
                                        </li> : 
                                        ''
                                    }
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><Button className="dropdown-item" onClick={logOut}>Logout</Button></li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {isShowAuthModal ? <AuthModal/> : ''}
        </nav>
    )
}

export default NavBar;