/**
 * PURPOSE:
 * only a user with administrative privileges may visit this screen.
 * this is for the admin to view all orders belonging to all users
 */

// routing
import { LinkContainer } from "react-router-bootstrap"
// state
import {useGetOrdersQuery} from '../../slices/ordersApiSlice'
// components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
// ui ux
import {Table, Button } from 'react-bootstrap'
import {FaTimes} from 'react-icons/fa'

const OrderListScreen = () => {
  //
  const {data: orders, isLoading, error} = useGetOrdersQuery();

  return (
    <>
      <h1>All Orders</h1>
      {
        isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
          <Table
            striped hover responsive
            className="table-sm"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {
                orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0,10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {
                        order.isPaid ? (
                          order.paidAt.substring(0,10)
                        ) : (
                          <FaTimes style={{color: 'red'}} />
                        )
                      }
                    </td>
                    <td>
                      {
                        order.isDelivered ? (
                          order.deliveredAt.substring(0,10)
                        ) : (
                          <FaTimes style={{color: 'red'}} />
                        )
                      }
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        )
      }
    </>
  )
}

export default OrderListScreen