import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            RAMS BOYS HOSTEL
          </h1>
          <p className="text-sm text-gray-600">
            Exclusive for VIT-AP Students
          </p>
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex gap-8 font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/booking">Book Now</Link></li>
        </ul>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;