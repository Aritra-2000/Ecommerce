import './App.css';
import Header from "./components/layout/Header/Header"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import webFont from "webfontloader"
import React, { useEffect, useState } from 'react';
import Footer from './components/layout/Footer/Footer';
import Home from "./components/Home/Home"
import ProductDetails from './components/Product/ProductDetails'
import Products from './components/Product/Products.js'
import Search from './components/Product/Search.js'
import LoginSignUp from './components/User/LoginSignUp';
import store from './store';
import Profile from "./components/User/Profile.js"
import { loadUser } from './actions/userAction';
import UserOptions from "./components/layout/Header/UserOptions"
import { useSelector } from 'react-redux';
import ProtectRoute from './components/Route/ProtectRoute';
import UpdateProfile from "./components/User/UpdateProfile"
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword'
import ResetPassword from './components/User/ResetPassword'
import Cart from './components/Cart/Cart'
import Shipping from './components/Cart/Shipping'
import ConfirmOrder from './components/Cart/ConfirmOrder'
import Payment from './components/Cart/Payment'
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/Cart/OrderSuccess'
import MyOrders from './components/Order/MyOrders'
import OrderDetails from './components/Order/OrderDetails'
import Dashboard from './components/admin/Dashboard'
import ProductList from './components/admin/ProductList'
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList'
import ProcessOrder from './components/admin/ProcessOrder'
import UserList from './components/admin/UserList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews.js'
import NotFound from './components/layout/Not Found/NotFound';


function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey(){
    const {data} = await axios.get("/api/v1//stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {

    webFont.load({
      google: {
        families: ["Roboto", "Driod Sans", "Chilanka"]
      }
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path='/product/:id' element={<ProductDetails />}></Route>
        <Route exact path='/products' element={<Products />} />
        <Route path='/products/:params' element={<Products />} />
        <Route exact path='/search' element={<Search />} />
        <Route element={<ProtectRoute />}>
          <Route path='/account' element={<Profile />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/me/update' element={<UpdateProfile />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/password/update' element={<UpdatePassword />} />
        </Route>
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path='/password/reset/:token' element={<ResetPassword />} />
        <Route exact path='/login' element={<LoginSignUp />} />
        <Route exact path='/cart' element={<Cart />} />
        <Route element={<ProtectRoute />}>
          <Route path='/shipping' element={<Shipping />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/success' element={<OrderSuccess />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/orders' element={<MyOrders />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/order/confirm' element={<ConfirmOrder />} />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path='/order/:id' element={<OrderDetails />} />
        </Route>
        <Route element={<ProtectRoute />}>
          {stripeApiKey && <Route exact path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>}/>}
      </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/products' element={<ProductList />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/product/new' element={<NewProduct />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/product/:id' element={<UpdateProduct />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/orders' element={<OrderList />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/order/:id' element={<ProcessOrder />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/users' element={<UserList />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/user/:id' element={<UpdateUser />} />
        </Route>
        <Route element={<ProtectRoute isAdmin={true}/>}>
          <Route path='/admin/reviews' element={<ProductReviews />} />
        </Route>
          <Route element={window.location.pathname === "/process/payment" ? null : <NotFound/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
