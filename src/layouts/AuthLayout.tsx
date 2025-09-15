import { Outlet } from "react-router-dom";
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AuthLayout = () =>{
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AuthLayout;