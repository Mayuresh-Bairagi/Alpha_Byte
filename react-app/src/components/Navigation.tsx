import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#2D5BFF] to-[#6B4FFE] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="p-2 bg-white/10 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <Link to="/" className="text-white font-bold text-xl tracking-wide">
              MediAssist
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              active={location.pathname === "/dashboard"}
            >
              Dashboard
            </NavLink>
            <NavLink to="/admin" active={location.pathname === "/admin"}>
              Admin
            </NavLink>

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-white/10 rounded-full pl-2 pr-4 py-1 text-white hover:bg-white/20 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#2D5BFF]" />
                </div>
                <span className="text-sm font-medium">Dr. Smith</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-1">
                <DropdownItem
                  href="#profile"
                  icon={<User className="h-4 w-4" />}
                >
                  Your Profile
                </DropdownItem>
                <DropdownItem
                  href="#settings"
                  icon={<Settings className="h-4 w-4" />}
                >
                  Settings
                </DropdownItem>
                <div className="border-t border-gray-100 my-1"></div>
                <DropdownItem
                  href="#logout"
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Sign out
                </DropdownItem>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 animate-fadeIn">
            <MobileNavLink to="/" active={location.pathname === "/"}>
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/dashboard"
              active={location.pathname === "/dashboard"}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/admin" active={location.pathname === "/admin"}>
              Admin
            </MobileNavLink>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center px-3 py-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-[#2D5BFF]" />
                </div>
                <span className="font-medium">Dr. Smith</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper Components
const NavLink: React.FC<{
  to: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-white text-[#2D5BFF]" : "text-white hover:bg-white/10"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{
  to: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
      active ? "bg-white text-[#2D5BFF]" : "text-white hover:bg-white/10"
    }`}
  >
    {children}
  </Link>
);

const DropdownItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, icon, children }) => (
  <a
    href={href}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
  >
    <span className="text-gray-400 mr-3">{icon}</span>
    {children}
  </a>
);

export default Navigation;
