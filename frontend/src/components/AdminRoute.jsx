import { useSelector } from 'react-redux';
import {Outlet, Navigate} from 'react-router-dom';
// Q-12

// NOTE: Outlet is returned if we are already logged in as a user
// NOTE: if not logged in as user, then use Navigate to redirect

const AdminRoute = () => {
    //
    const {userInfo} = useSelector(state => state.auth)

    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />
    // NOTE: replace in <Navigate /> is supposed to replace any past history
}

export default AdminRoute;