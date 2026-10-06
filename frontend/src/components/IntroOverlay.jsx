import React, { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const CLOUDINARY_IMAGE_URL =
  "https://res.cloudinary.com/duweg8kpv/image/upload/v1790860229/tella-app-removebg-preview_elnzbl.png";

const DISPLAY_DURATION_MS = 9000;
const EXIT_DURATION_MS = 7000;

export default function IntroOverlay({
  isOpen,
  onClose,
  imageUrl = CLOUDINARY_IMAGE_URL,
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsExiting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, DISPLAY_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isExiting) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, EXIT_DURATION_MS);
  };

  return (
    <div
      id="kryptella-intro-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 90% 70% at 50% 20%, #0E1C44 0%, #060B18 60%, #03060F 100%)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting
          ? "scale(1.04) translateY(-12px)"
          : "scale(1) translateY(0)",
        transition: `opacity ${EXIT_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${EXIT_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {/* Ambient Cosmic Radial Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "10%",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "5%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 75%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Massive Glassmorphic Ambient Watermark Typography */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(70px, 15vw, 220px)",
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: "rgba(255, 255, 255, 0.025)",
          textShadow: "0 0 80px rgba(99, 102, 241, 0.08)",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontFamily: "Inter, sans-serif",
          zIndex: 0,
        }}
      >
        KRYPTELLA
      </div>

      {/* Top Navigation Bar: Branding Only */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "clamp(12px, 2.5vw, 24px) clamp(16px, 3.5vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          zIndex: 10,
        }}
      >
        {/* Top-Left Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: "clamp(36px, 6vw, 44px)",
              height: "clamp(36px, 6vw, 44px)",
              borderRadius: 12,
              background: "rgba(245, 158, 11, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(245, 158, 11, 0.3)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              padding: 4,
            }}
          >
            <img
              src="https://res.cloudinary.com/duweg8kpv/image/upload/v1790775110/k-logo-good-removebg-preview_c50puh.png"
              alt="Kryptella Logo"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 36,
                maxWidth: 36,
                objectFit: "contain",
                filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "clamp(15px, 3vw, 20px)",
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              KRYPTELLA
            </div>
            <div
              style={{
                fontSize: "clamp(9px, 1.8vw, 11px)",
                fontWeight: 600,
                color: "#93C5FD",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Direct Settlement Platform
            </div>
          </div>
        </div>
      </div>

      {/* Main Intro Showcase Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 960,
          width: "100%",
          padding: "clamp(80px, 12vw, 120px) clamp(16px, 5vw, 40px) clamp(24px, 5vw, 40px)",
          textAlign: "center",
        }}
      >
        {/* Dashboard Showcase Image */}
        <div
          className="slide-from-left"
          style={{
            margin: "0 auto 16px",
            position: "relative",
            perspective: 1200,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "clamp(220px, 80vw, 460px)",
              maxWidth: "100%",
              height: "clamp(160px, 24vw, 310px)",
              overflow: "hidden",
              transform: "rotateY(-4deg) rotateX(2deg)",
              transition: "transform 0.4s ease",
            }}
          >
            <img
              src={imageUrl}
              alt="Kryptella Mobile Dashboard"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </div>

        {/* Headline & Value Proposition */}
        <div
          className="slide-from-bottom"
          style={{
            maxWidth: 620,
            width: "100%",
            margin: "0 auto 24px",
            padding: "0 clamp(8px, 3vw, 0px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(22px, 4.5vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "#FFFFFF",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Direct Crypto Settlement.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Zero Middleman Custody.
            </span>
          </h1>
          <p
            style={{
              fontSize: "clamp(13px, 2.2vw, 15px)",
              color: "#94A3B8",
              lineHeight: 1.6,
              margin: "0 auto",
            }}
          >
            No funding delay. No custodial wallet risks. Choose your coin, pay
            with ease, and receive crypto directly in your private wallet within
            minutes.
          </p>
        </div>

        {/* Action Button */}
        <div
          className="pop-up"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            width: "100%",
          }}
        >
          <button
            id="enter-kryptella-btn"
            onClick={handleClose}
            className="btn btn-glass-primary btn-lg"
            style={{
              fontSize: "clamp(13px, 3.2vw, 16px)",
              fontWeight: 700,
              padding: "clamp(11px, 2.5vw, 16px) clamp(22px, 5vw, 38px)",
              borderRadius: 9999,
              letterSpacing: "0.02em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              maxWidth: "min(100%, 380px)",
              width: "auto",
              boxShadow:
                "0 12px 38px rgba(79, 70, 229, 0.45), 0 0 20px rgba(59, 130, 246, 0.35)",
            }}
          >
            <span>Trade Crypto with Kryptella</span>
            <ArrowRight size={18} />
          </button>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px 18px",
              color: "#64748B",
              fontSize: "clamp(11px, 2vw, 12px)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ShieldCheck size={14} color="#60A5FA" /> Bank-Grade Fortified
            </span>
            <span style={{ color: "#334155" }}>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={14} color="#F59E0B" /> Sub-Minute Dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}