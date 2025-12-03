"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

export default function OrganizerSidebar() {
  const pathname = usePathname();

  const NavItem = ({ href, label, icon: Icon }) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${active ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-800"}`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800 p-4">
      <h2 className="text-2xl font-bold text-white mb-8 px-2">Organizer</h2>

      <nav className="flex flex-col gap-2">
        <NavItem href="/organizer/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <NavItem href="/organizer/events/create" label="Create Event" icon={PlusCircle} />
        <NavItem href="/organizer/events" label="My Events" icon={Calendar} />
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
