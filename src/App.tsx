import Layout from './components/UI/Layout/Layout';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/reducers/auth/authActionCreators';

function App() {  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <Layout/>
    </div>
  );
}

export default App;











// import './App.scss';
// import Header from './components/Header/Header';
// import Notifications from './components/UI/Notifications/Notifications';
// import AppRouter from './components/UI/AppRouter/AppRouter';
// import { RootState } from './store/store';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkAuth } from './store/reducers/auth/authActionCreators';

// function App() {  
//   const notes = useSelector((state: RootState) => state.notifications);
//   const dispatch = useDispatch();
//   // const {auth} = useSelector((state: RootState) => state);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       dispatch(checkAuth());
//     }
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <Header />
//       <main>
//         <AppRouter />
//       </main>
//       {notes.length > 0 ? <Notifications /> : ''}
//     </div>
//   );
// }

// export default App;
