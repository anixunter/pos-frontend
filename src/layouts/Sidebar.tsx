import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { name: 'Sales', path: '/sales' },
  { name: 'Returns', path: '/returns' },
  { name: 'Customers', path: '/customers' },
  { name: 'Deposits', path: '/deposits' },
  { name: 'Inventory Adjustment', path: '/inventory-adjustment' },
  { name: 'Purchase Orders', path: '/purchase-orders' },
  { name: 'Products', path: '/products' },
  { name: 'Suppliers', path: '/suppliers' },
  { name: 'Categories', path: '/categories' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <nav className="mt-5 px-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;