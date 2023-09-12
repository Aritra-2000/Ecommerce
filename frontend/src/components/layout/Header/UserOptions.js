import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from '@mui/material'
import { MdDashboard, MdExitToApp, MdListAlt, MdPerson, MdShoppingCart } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import { useDispatch, useSelector } from 'react-redux'


const UserOptions = ({user}) => {

  const {cartItems} = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const options = [
    {icon:<MdListAlt/>, name: "Orders", func: orders},
    {icon:<MdPerson/>, name: "Profile", func: account},
    {icon:<MdShoppingCart  style={{color:cartItems.length>0 ? "tomato" : "unset"}}/>, name: `Cart(${cartItems.length})`, func: cart},
    {icon:<MdExitToApp/>, name: "Logout", func: logoutUser},
  ];

  if(user.role === "admin"){
    options.unshift({icon:<MdDashboard/>, name: "Dashboard", func: dashboard})
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }

  function account() {
    navigate("/account");
  }

  function cart() {
    navigate("/cart");
  }

  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully")
  }


  return (
    <Fragment>
    {/* <Backdrop open={true} style={{zIndex: "10"}} /> */}
    <SpeedDial
       ariaLabel='Speed tooltip example'
       onClose={() => setOpen(false)}
       onOpen={() => setOpen(true)}
       style={{zIndex: '11'}}
       open={open}
       direction='down'
       className='speedDial'
       icon={ <img
          className='speedDialIcon'
          src={user.avatar.url ? user.avatar.url : "/Profile.png"}
          alt='Profile'
       />}
    >

    {options.map((item)=> (
      <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} tooltipOpen={window.innerWidth<=600 ? true : false} onClick={item.func}/>
    ))}


    </SpeedDial>

    </Fragment>
  )
}

export default UserOptions;