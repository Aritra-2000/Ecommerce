import { DataGrid } from '@mui/x-data-grid'
import React, { Fragment, useEffect } from 'react'
import "./productList.css"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import { MdDelete, MdEdit } from 'react-icons/md'
import Sidebar from './Sidesbar'
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction'
import { DELETE_USER_RESET } from '../../constants/userConstant'

const UserList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const alert = useAlert();

    const { error, users} = useSelector((state) => state.allUsers);

    const {error: deleteError, isDeleted, message} = useSelector((state) => state.profile)

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }
 

    const columns = [
        { field: "id", headerName: "User ID", minwidth: 180, flex: 0.8 },
        { field: "email", headerName: "Email", minwidth: 200, flex: 1 },
        { field: "name", headerName: "Name", minwidth: 150, flex: 0.5 },
        { 
            field: "role", 
            headerName: "Role", 
            minwidth: 150, 
            flex: 0.3,
            cellClassName: (params) => {
                return params.row.role === "admin"
                    ? "greenColor": "redColor";
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minwidth: 150,
            sortable: false,
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.row.id}`}>
                            <MdEdit />
                        </Link>

                        <Button onClick={() => deleteUserHandler(params.row.id)}>
                            <MdDelete />
                        </Button>

                    </Fragment>
                );
            },
        },
    ]

    const rows = [];

    users &&
        users.forEach((item) => {
            rows.push({
                id: item._id,
                role: item.role,
                email: item.email,
                name: item.name,
            });
        });


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(deleteError){
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if(isDeleted){
            alert.success(message);
            navigate("/admin/users");
            dispatch({type: DELETE_USER_RESET});
        }

        dispatch(getAllUsers());

    }, [dispatch, alert, error, navigate, isDeleted, deleteError, message]);

    return (
        <Fragment>
            <MetaData title={`ALL USERS - ADMIN`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL USERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
}

export default UserList