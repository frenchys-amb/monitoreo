import LogoutOrLogin from "./LogoutOrLogin";

export default function NavBar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
  <div className="flex justify-between items-center w-full">
    <div></div>
    <div>
      <LogoutOrLogin />
    </div>
  </div>
</nav>

  );
}
