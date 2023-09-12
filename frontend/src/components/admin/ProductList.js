import { DataGrid } from '@mui/x-data-grid'
import React, { Fragment, useEffect } from 'react'
import "./productList.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, deleteProduct, getAdminProduct } from '../../actions/productAction'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import { MdDelete, MdEdit } from 'react-icons/md'
import Sidebar from './Sidesbar'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'


const ProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const alert = useAlert();

    const { error, products } = useSelector((state) => state.products);

    const {error: deleteError, isDeleted} = useSelector((state) => state.product)

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }
 

    const columns = [
        { field: "id", headerName: "Product ID", minwidth: 200, flex: 0.5 },
        { field: "name", headerName: "Name", minwidth: 350, flex: 1 },
        { field: "stock", headerName: "Stock", type: "number", minwidth: 150, flex: 0.3 },
        { field: "price", headerName: "Price", type: "number", minwidth: 270, flex: 0.5 },
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
                        <Link to={`/admin/product/${params.row.id}`}>
                            <MdEdit />
                        </Link>

                        <Button onClick={() => deleteProductHandler(params.row.id)}>
                            <MdDelete />
                        </Button>

                    </Fragment>
                );
            },
        },
    ]

    const rows = [];

    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.stock,
                price: item.price,
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
            alert.success("Product Deleted Successfully");
            navigate("/admin/dashboard");
            dispatch({type: DELETE_PRODUCT_RESET});
        }

        dispatch(getAdminProduct());

    }, [dispatch, alert, error, navigate, isDeleted, deleteError]);

    return (
        <Fragment>
            <MetaData title={`ALL PRODUCTS - ADMIN`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

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
};

export default ProductList