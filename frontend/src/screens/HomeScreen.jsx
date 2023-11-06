//
import { Link, useParams } from "react-router-dom";
//
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
// components
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from '../components/Paginate';
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  // get pageNumber param from the ur
  const { keyword, pageNumber } = useParams();
  //
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber }); // Q-29

  return (
    <>
      {!keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-light mb-4">Go back</Link>}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="warning">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate page={data.page} pages={data.pages} keyword={keyword ? keyword : ""} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
