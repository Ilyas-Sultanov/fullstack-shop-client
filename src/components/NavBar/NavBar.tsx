import { FC, useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './NavBar.scss';
import { ReactComponent as AuthIcon } from '../../img/box-arrow-in-right.svg';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { authActions } from '../../store/reducers/auth/auth';
import AuthModal from '../AuthModal/AuthModal';
import Button from "../UI/Button/Button";
import { fetchLogOut } from '../../store/reducers/auth/authActionCreators';
import { notificationActions } from "../../store/reducers/notifications";
import { categoriesMenuActions } from '../../store/reducers/categoriesMenu/categoriesMenu';

const NavBar: FC = () => {
    const [menuIsCollapsed, setMenuIsCollapsed] = useState(true);
    const navigate = useNavigate();

    const { user, isAuth, isShowAuthModal } = useSelector((state: RootState) => state.auth);
    const { isShowCategoriesMenu } = useSelector((state: RootState) => state.categoriesMenu);
    const dispatch = useDispatch();

    const toggleNavMenu = useCallback(
        function() {
            setMenuIsCollapsed(!menuIsCollapsed);
        },
        [menuIsCollapsed]
    );

    const showAuthModal = useCallback(
        function() {
            dispatch(authActions.setIsShowAuthModal(true));
        },
        [dispatch]
    ); 

    const toggleCategoriesMenu = useCallback(
        function() {
            dispatch(categoriesMenuActions.setIsShowCategoriesMenu(!isShowCategoriesMenu));
            setMenuIsCollapsed(true);
        },
        [dispatch, isShowCategoriesMenu]
    );

    const authBtnHandler = useCallback(
        function() {
            toggleNavMenu(); 
            showAuthModal();
        },
        [toggleNavMenu, showAuthModal]
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
            toggleNavMenu();
        },
        [navigate, toggleNavMenu]
    );

   

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark header__navbar">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="">LOGO</NavLink>
                <button 
                    className={`navbar-toggler ${menuIsCollapsed ? "collapsed" : ""}`}
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded={menuIsCollapsed ? false : true} 
                    aria-label="Toggle navigation"
                    onClick={toggleNavMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse bg-dark ${menuIsCollapsed ? "" : "show"}`} id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Button className="catalog-btn" onClick={toggleCategoriesMenu}>Catalog</Button>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about" onClick={toggleNavMenu}>About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contacts" onClick={toggleNavMenu}>Contacts</NavLink>
                        </li>
                    </ul>

                    <div className="auth-buttons">
                        {   
                            !isAuth ?
                            <Button 
                                className={`btn-primary auth-btn`}
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
