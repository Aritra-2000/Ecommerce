import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from "../../actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/Loaders';
import { useAlert } from 'react-alert';
import ProductCard from './ProductCard.js';

const Home = () => {
    
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products} = useSelector(
        state => state.products
    )

    useEffect(() => {

        if(error) {
            alert.error(error);
            dispatch(clearErrors);
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <>
            {loading ? <Loader/> : <>
                <MetaData title="Eccomerce" />
                <div className="banner">
                    <p>Welcome to Eccomerce</p>
                    <h1>FIND AMAZING PRODUCTS BELOW</h1>

                    <a href="#container">
                        <button>
                            scroll <CgMouse />
                        </button>
                    </a>
                </div>
                <h2 className="homeHeading">Fearured Products</h2>

                <div className="container" id='container'>
                    {products && products.map(product => (
                        <ProductCard product={product} key={product.name} />
                    ))}
                </div>
            </>}
        </>
    )
}

export default Home