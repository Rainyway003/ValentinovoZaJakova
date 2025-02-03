import React from 'react'
import ReactDOM from 'react-dom/client'
import './data/firebase/firebase.js'
import './input.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import LoginScreen, { loginScreenAction } from "./ui/auth/LoginScreen.jsx";
import { Provider } from "react-redux";
import store from "./data/store/store.js";
import Waiting from './ui/waiting/Waiting.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
    action: loginScreenAction,
  },
  {
    path: "/waiting",
    element: <Waiting />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
