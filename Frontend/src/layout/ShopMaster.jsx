import ShopHeader from "./ShopHeader"
import ShopFooter from "./ShopFooter"
import { Outlet } from "react-router-dom"
export default function ShopMaster(){
    return(
        <>
        <ShopHeader/>
        <Outlet/>
        <ShopFooter/>
        </>
    )
}