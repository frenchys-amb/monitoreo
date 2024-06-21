import LogoutOrLogin from "./LogoutOrLogin";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-sky-900 text-white p-4">
      <div className="flex justify-between items-center w-full">
        <div>
          <ul className="flex space-x-4">
            <li>
              <h1 className="text-2xl font-bold text-white mb-4">MediTrack</h1>
            </li>
            <li>
              <Link href="/home">
                <span className="py-2 text-lg hover:underline">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/storage">
                <span className="py-2 text-lg hover:underline">Storage</span>
              </Link>
            </li>
            <li>
              <Link href="/medication">
                <span className="py-2 text-lg hover:underline">Medication</span>
              </Link>
            </li>
            <li>
              <Link href="/report">
                <span className="py-2 text-lg hover:underline">Report</span>
              </Link>
            </li>
            <li>
            <Link href="/unit">
              <span className="py-2 text-lg hover:underline">Unit</span>
            </Link>
            </li>
          </ul>
        </div>
        <div>
          <LogoutOrLogin />
        </div>
      </div>
    </nav>
  );
}
