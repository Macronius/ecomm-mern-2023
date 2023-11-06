// routing
import {Outlet} from 'react-router-dom'
// components
import Header from "./components/Header";
import Footer from "./components/Footer";
// style
import { Container } from "react-bootstrap";
// alerts
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          {/* <h1>Welcome to the ProShop</h1> */}
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />  
      {/* LL-05 */}
    </>
  );
};

export default App;
