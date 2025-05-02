import React from 'react'
import Navbar from './Navbar';
import Aside from './Aside';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="flex">
                <Aside />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}

export default Layout;