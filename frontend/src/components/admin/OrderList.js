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
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction'
import { DELETE_ORDERS_RESET } from '../../constants/orderConstant'

const OrderList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const alert = useAlert();

    const { error, orders } = useSelector((state) => state.allOrders);

    const { error: deleteError , isDeleted} = useSelector((state) => state.order);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }
 

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.status === "Delivered"
                    ? "greenColor": "redColor";
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.4
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/order/${params.row.id}`}>
                            <MdEdit />
                        </Link>

                        <Button onClick={() => deleteOrderHandler(params.row.id)}>
                            <MdDelete />
                        </Button>

                    </Fragment>
                );
            },
        },
    ]

    const rows = [];

    orders &&
        orders.forEach((item) => {
            rows.push({
                id: item._id,
                itemsQty: item.orderItems?.length,
                amount: item.totalPrice,
                status: item.orderStatus,
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
            alert.success("Order Deleted Successfully");
            navigate("/admin/orders");
            dispatch({type: DELETE_ORDERS_RESET});
        }

        dispatch(getAllOrders());

    }, [dispatch, alert, error, navigate, isDeleted, deleteError]);

    return (
        <Fragment>
            <MetaData title={`ALL ORDERS - ADMIN`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableRowSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
}

export default OrderList