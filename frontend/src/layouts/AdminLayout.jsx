import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <header>Admin Panel</header>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;