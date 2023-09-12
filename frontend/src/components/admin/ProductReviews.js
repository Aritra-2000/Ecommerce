import { DataGrid } from '@mui/x-data-grid'
import React, { Fragment, useEffect, useState } from 'react'
import "./productReviews.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import { MdDelete, MdStar } from 'react-icons/md'
import Sidebar from './Sidesbar'
import { DELETE_REVIEW_RESET } from '../../constants/productConstants'
import { clearErrors, deleteReviews, getAllReview } from '../../actions/productAction'

const ProductReviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const alert = useAlert();

    const { error: deleteError, isDeleted } = useSelector((state) => state.review);

    const { error, reviews, loading } = useSelector((state) => state.productReviews)

    const [productId, setProductId] = useState("");

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId, productId));
    }

    const productReviewSubmitHandler = (e) => {
       e.preventDefault();

       dispatch(getAllReview(productId));
    }


    const columns = [
        { field: "id", headerName: "Review ID", minwidth: 200, flex: 0.5 },
        { field: "user", headerName: "User", minwidth: 200, flex: 0.6 },
        { field: "comment", headerName: "Comment", minwidth: 350, flex: 1 },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minwidth: 180,
            flex: 0.4,
            cellClassName: (params) => {
                return params.row.role === ("rating" >= 3)
                    ? "greenColor" : "redColor";
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
                        <Button onClick={() => deleteReviewHandler(params.row.id)}>
                            <MdDelete />
                        </Button>

                    </Fragment>
                );
            },
        },
    ]

    const rows = [];

    reviews &&
        reviews.forEach((item) => {
            rows.push({
                id: item._id,
                rating: item.rating,
                comment: item.comment,
                user: item.name,
            });
        });


    useEffect(() => {


        if(productId.length === 24){
            dispatch(getAllReview(productId));
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Review Deleted Successfully");
            navigate("/admin/reviews");
            dispatch({ type: DELETE_REVIEW_RESET });
        }

        // dispatch(getAdminProduct());

    }, [dispatch, alert, error, navigate, isDeleted, deleteError, productId]);

    return (
        <Fragment>
            <MetaData title={`ALL REVIEWS - ADMIN`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productReviewsContainer">

                    <form
                        className='productReviewsForm'
                        onSubmit={productReviewSubmitHandler}
                    >
                        <h1 className='productReviewsFormHeading'>ALL REVIEWS</h1>

                        <div>
                            <MdStar />
                            <input
                                type='text'
                                placeholder='Product Id'
                                required
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>

                        <Button
                            id='createProductBtn'
                            type='submit'
                            disabled={loading ? true : false || productId === "" ? true : false}
                        >
                            Search
                        </Button>
                    </form>

                    {reviews && reviews.length > 0 ? (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}

                            className='productListTable'
                            autoHeight
                        />) : (<h1 className='productReviewsFormHeading'>
                            No Reviews Found
                        </h1>
                        )}
                </div>
            </div>
        </Fragment>
    );
}

export default ProductReviews