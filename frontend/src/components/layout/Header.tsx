import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Generate" },
  { to: "/history", label: "History" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold text-white">
          Game Asset Generator
        </h1>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
