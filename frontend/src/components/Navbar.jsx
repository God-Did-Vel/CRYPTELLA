import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  BarChart2,
  Users,
  HelpCircle,
} from "lucide-react";

const Logo = () => (
  <Link
    to="/"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <img
        src="https://res.cloudinary.com/duweg8kpv/image/upload/v1790775110/k-logo-good-removebg-preview_c50puh.png"
        alt="Cryptella Logo"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: 38,
          maxWidth: 38,
          objectFit: "contain",
          filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))",
          transition: "transform 0.25s ease",
          display: "block",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </div>
    <span
      style={{
        fontWeight: 900,
        letterSpacing: "0.02em",
        fontSize: 20,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <span style={{ color: "#FFFFFF" }}>KRYP</span>
      <span
        style={{
          color: "#F59E0B",
          background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        TELLA
      </span>
    </span>
  </Link>
);

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = !isLoggedIn
    ? null
    : user?.role === "admin"
      ? [
          {
            label: "Overview",
            to: "/admin",
            icon: <LayoutDashboard size={16} />,
          },
          {
            label: "Orders",
            to: "/admin/orders",
            icon: <ClipboardList size={16} />,
          },
          { label: "Users", to: "/admin/users", icon: <Users size={16} /> },
          { label: "Markets", to: "/markets", icon: <BarChart2 size={16} /> },
        ]
      : [
          {
            label: "Dashboard",
            to: "/dashboard",
            icon: <LayoutDashboard size={16} />,
          },
          { label: "Markets", to: "/markets", icon: <BarChart2 size={16} /> },
          { label: "Orders", to: "/orders", icon: <ClipboardList size={16} /> },
        ];
  const links = navLinks || [
    { label: "Markets", to: "/markets", icon: <BarChart2 size={16} /> },
    { label: "Help", to: "/help", icon: <HelpCircle size={16} /> },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(11,15,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(51,65,85,0.6)"
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Logo />

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          className="nav-links"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === l.to ? "#6366F1" : "#94A3B8",
                background:
                  location.pathname === l.to
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                transition: "all 0.2s",
              }}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                {user?.firstName}
                <ChevronDown size={14} />
              </button>
              {dropOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 8,
                    minWidth: 180,
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border)",
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {user?.email}
                    </div>
                  </div>
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setDropOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 12px",
                        borderRadius: 6,
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--bg-card-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {l.icon}
                      {l.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      fontSize: 14,
                      color: "var(--red)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--red-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              padding: 4,
              display: "none",
            }}
            className="hamburger"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px 24px",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 0",
                borderBottom: "1px solid var(--border-light)",
                fontSize: 15,
                color: "var(--text-primary)",
              }}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Link to="/login" className="btn btn-secondary btn-full">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-full">
                Get Started
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-full"
              style={{ marginTop: 16 }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
