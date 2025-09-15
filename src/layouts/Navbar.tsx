import { useAuthStore } from "@/stores/authStore";

const Navbar = () => {
    const logout = useAuthStore((state) => state.logout)
  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
        <h1 className="text-3xl font-bold">Hardware Store</h1>
        <button onClick={logout} className="text-red-600 hover:text-red-800">
            Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;