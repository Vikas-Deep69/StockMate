import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import AdminMaster from "./layout/AdminMaster"
import AdminDashboard from "./Admin/AdminDashboard"

import ManageCategory from "./Admin/category/ManageCategory"
import ManageUsers from "./Admin/user/ManageUsers"

import AdminSales from "./Admin/AdminSales"
import ShopMaster from "./layout/ShopMaster"

import ShopKeeperDashboard from "./ShopKeeper/ShopKeeperDashboard"
import ShopKeeperViewProducts from "./ShopKeeper/product/ShopKeeperViewProducts"

import WholeMaster from "./layout/WholeMaster"
import WholeSalerDashboard from "./Wholesaler/WholeSalerDashboard"
import Register from './components/Register'
import { ToastContainer } from "react-toastify"
import ManageProducts from './Wholesaler/product/ManageProducts'
import ViewWholesalers from './ShopKeeper/ViewWholesalers'
import ProductsByWholesaler from './ShopKeeper/product/ProductsByWholesaler'
import ShopkeeperRequests from './ShopKeeper/ShopkeeperRequests'
import WholesalerRequests from './Wholesaler/WholesalerRequests'
import AdminManageProducts from './Admin/product/AdminManageProducts'
import WholesalerSales from './Wholesaler/WholesalerSales'
import WholesalerProfile from './Wholesaler/WholesalerProfile'
import ShopkeeperSales from './ShopKeeper/ShopkeeperSales'
import ShopkeeperProfile from './ShopKeeper/ShopkeeperProfile'
import MechAI from './MechAI'



function App() {
  return (
    <>
     
      <BrowserRouter>

        <Routes>
          
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />


          <Route path='/admin' element={<AdminMaster />}>
          
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/category/manage' element={<ManageCategory />} />
            <Route path='/admin/product/manage' element={<AdminManageProducts />} />
            <Route path='/admin/users/manage' element={<ManageUsers />} />
            <Route path='/admin/sales' element={<AdminSales />} />
          </Route>

          <Route path='/shop' element={<ShopMaster />}>
            <Route path='/shop' element={<ShopKeeperDashboard />} />
            <Route path='/shop/products/view' element={<ShopKeeperViewProducts />} />
            <Route path='/shop/wholesalers/view' element={<ViewWholesalers />} />
            <Route path='/shop/requests' element={<ShopkeeperRequests />} />
            <Route path='/shop/sales' element={<ShopkeeperSales />} />
            <Route path='/shop/profile' element={<ShopkeeperProfile />} />
            <Route path='/shop/Ai' element={<MechAI />} />
            <Route path='/shop/product/bywholesaler/:wholesalerId' element={<ProductsByWholesaler />} />

          </Route>

          <Route path='/whole' element={<WholeMaster />}>
            <Route path='/whole' element={<WholeSalerDashboard />} />
            <Route path='/whole/profile' element={<WholesalerProfile />} />
            <Route path='/whole/products/manage' element={<ManageProducts />} />
            <Route path='/whole/requests' element={<WholesalerRequests />} />
            <Route path='/whole/sales' element={<WholesalerSales />} />
            <Route path='/whole/Ai' element={<MechAI />} />


          </Route>

        </Routes>
      </BrowserRouter >
      <ToastContainer />
    </>

  )
}

export default App
