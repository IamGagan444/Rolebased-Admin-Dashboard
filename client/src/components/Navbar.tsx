import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import Cookies from "js-cookie";

const Navbar = () => {
  const token = Cookies.get("token");
  console.log(token);
  return (
    <div className="fixed h-[4.5rem] z-20 inset-0 bg-black ">
      <nav className="flex h-full  shadow-lg justify-around items-center ">
        <h2 className="text-2xl font-bold">Dashboard'</h2>
        <ol className=" flex space-x-6 items-center">
          <li>
            {" "}
            <Link to={"/"}>Home</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to={"/dashboard"}>Dashboard</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to={"/about"}>About</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to={"/contact-us"}>Contact Us</Link>{" "}
          </li>
          {token ? (
            ""
          ) : (
            <li>
              {" "}
              <Link to={"/login"}>Login</Link>{" "}
            </li>
          )}

          <li>
            {" "}
            <ModeToggle />
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Navbar;
