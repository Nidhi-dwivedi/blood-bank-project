import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="app-navbar">
      <div className="container app-navbar-inner">
        <Link className="brand-mark" to="/">
          <span className="brand-symbol">BB</span>
          Blood Bank
        </Link>

        <div className="nav-actions">
          <Link className="nav-link-button" to="/">
            Samples
          </Link>

          {user?.role === "hospital" && (
            <>
              <Link className="nav-link-button" to="/add-blood">
                Add Blood
              </Link>
              <Link className="nav-link-button" to="/requests">
                Requests
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="user-chip">
                {user.name}
                {user.blood_group ? ` (${user.blood_group})` : ""}
              </span>
              <button className="nav-outline-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-primary-button" to="/login">
                Login
              </Link>
              <Link className="nav-outline-button" to="/register/receiver">
                Receiver
              </Link>
              <Link className="nav-outline-button" to="/register/hospital">
                Hospital
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
