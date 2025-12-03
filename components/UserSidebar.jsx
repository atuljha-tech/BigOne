"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, User, LogOut } from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();

  const Item = ({ href, label, icon: Icon }) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition 
        ${active ? "bg-purple-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-800"}`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800 p-4">
      <h2 className="text-2xl font-bold text-white mb-8 px-2">User Panel</h2>

      <nav className="flex flex-col gap-2">
        <Item href="/user/dashboard" label="Home" icon={Home} />
        <Item href="/user/bookings" label="My Tickets" icon={Ticket} />
        <Item href="/user/profile" label="Profile" icon={User} />
      </nav>

      <button
        className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-300 px-4 py-3"
        onClick={() => signOut()}
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}
