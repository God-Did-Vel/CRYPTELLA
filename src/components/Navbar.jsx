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
  Award,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Logo = () => (
  <Link
    to="/"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 9,
      textDecoration: "none",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <img
        src="https://res.cloudinary.com/duweg8kpv/image/upload/v1790775110/k-logo-good-removebg-preview_c50puh.png"
        alt="Kryptella Logo"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: 34,
          maxWidth: 34,
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
        letterSpacing: "0.03em",
        fontSize: "clamp(16px, 3.8vw, 19px)",
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
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
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleScrollToHash = (hashStr) => {
    setMenuOpen(false);
    const targetId = hashStr.replace("#", "");
    if (location.pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  const navLinks = !isLoggedIn
    ? null
    : user?.role === "admin"
      ? [
          {
            label: "Overview",
            to: "/admin",
            icon: <LayoutDashboard size={15} />,
          },
          {
            label: "Orders",
            to: "/admin/orders",
            icon: <ClipboardList size={15} />,
          },
          { label: "Users", to: "/admin/users", icon: <Users size={15} /> },
          { label: "Markets", to: "/markets", icon: <BarChart2 size={15} /> },
        ]
      : [
          {
            label: "Dashboard",
            to: "/dashboard",
            icon: <LayoutDashboard size={15} />,
          },
          { label: "Markets", to: "/markets", icon: <BarChart2 size={15} /> },
          { label: "Orders", to: "/orders", icon: <ClipboardList size={15} /> },
          { label: "How It Works", hash: "how-it-works", icon: <Zap size={15} /> },
        ];

  const defaultLinks = [
    { label: "Markets", to: "/markets", icon: <BarChart2 size={15} /> },
    { label: "About Us", hash: "about", icon: <Award size={15} /> },
    { label: "How It Works", hash: "how-it-works", icon: <Zap size={15} /> },
    { label: "Why Kryptella", hash: "why-us", icon: <ShieldCheck size={15} /> },
    { label: "Help", to: "/help", icon: <HelpCircle size={15} /> },
  ];

  const links = navLinks || defaultLinks;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(7, 11, 20, 0.94)" : "rgba(7, 11, 20, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(56, 189, 248, 0.2)"
          : "1px solid rgba(255, 255, 255, 0.06)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
          gap: 16,
        }}
      >
        <Logo />

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          className="nav-links"
        >
          {links.map((l) =>
            l.hash ? (
              <button
                key={l.hash}
                onClick={() => handleScrollToHash(l.hash)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#94A3B8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#94A3B8";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {l.icon}
                {l.label}
              </button>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: location.pathname === l.to ? "#60A5FA" : "#94A3B8",
                  background:
                    location.pathname === l.to
                      ? "rgba(59, 130, 246, 0.12)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== l.to) {
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== l.to) {
                    e.currentTarget.style.color = "#94A3B8";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {l.icon}
                {l.label}
              </Link>
            )
          )}
        </div>

        {/* Right side (Desktop auth + Hamburger toggle) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  borderRadius: 10,
                  padding: "7px 12px",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <span className="user-firstname-text">{user?.firstName}</span>
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
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 190,
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
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {user?.email}
                    </div>
                  </div>
                  {links.map((l) =>
                    l.hash ? (
                      <button
                        key={l.hash}
                        onClick={() => {
                          setDropOpen(false);
                          handleScrollToHash(l.hash);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {l.icon}
                        {l.label}
                      </button>
                    ) : (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setDropOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          transition: "all 0.15s",
                        }}
                      >
                        {l.icon}
                        {l.label}
                      </Link>
                    )
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--red)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      marginTop: 4,
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Desktop Auth Buttons (Cleanly hidden on mobile so navbar never scatters) */
            <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{
                  borderRadius: 9999,
                  padding: "7px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-glass-primary btn-sm"
                style={{
                  borderRadius: 9999,
                  padding: "7px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Luxury High-Contrast Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            aria-label="Toggle navigation menu"
            style={{
              background: menuOpen ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.06)",
              border: menuOpen ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: 10,
              color: "#FFFFFF",
              padding: "7px 9px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {menuOpen ? <X size={21} color="#F59E0B" /> : <Menu size={21} color="#FFFFFF" />}
          </button>
        </div>
      </div>

      {/* Luxury Mobile Menu Drawer with Smooth Glassmorphic Backdrop */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(9, 14, 28, 0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(56, 189, 248, 0.25)",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8)",
            padding: "16px 20px 24px",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((l) =>
              l.hash ? (
                <button
                  key={l.hash}
                  onClick={() => handleScrollToHash(l.hash)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#F1F5F9",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span style={{ color: "#F59E0B" }}>{l.icon}</span>
                  <span>{l.label}</span>
                </button>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: location.pathname === l.to ? "#60A5FA" : "#F1F5F9",
                    background:
                      location.pathname === l.to
                        ? "rgba(59, 130, 246, 0.12)"
                        : "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <span style={{ color: location.pathname === l.to ? "#60A5FA" : "#94A3B8" }}>
                    {l.icon}
                  </span>
                  <span>{l.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Action buttons inside hamburger on mobile */}
          {!isLoggedIn ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 18,
                paddingTop: 16,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn btn-secondary btn-full"
                style={{
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="btn btn-glass-primary btn-full"
                style={{
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-full"
              style={{
                marginTop: 16,
                padding: "12px",
                color: "var(--red)",
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}

      {/* Responsive Navbar Media Query Rules */}
      <style>{`
        .hamburger-btn {
          display: none;
        }
        @media (max-width: 880px) {
          .nav-links {
            display: none !important;
          }
          .nav-auth-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
