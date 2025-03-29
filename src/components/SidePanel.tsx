import React, { useEffect, useState } from "react";
import "./componentStyling.css";

import atlarSvg from "/images/atlar-logo.svg";
import houseSvg from "/images/nav-house.svg";
import bankSvg from "/images/nav-bank.svg";
import paymentSvg from "/images/nav-payments.svg";
import approvalSvg from "/images/nav-approvals.svg";
import analyticSvg from "/images/nav-analytics.svg";
import settingSvg from "/images/nav-settings.svg";
import { useNavigate } from "react-router-dom";

interface SidePanelProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

/**
 * @component
 * A side panel component that provides navigation functionality.
 *
 * @returns {JSX.Element} The rendered side panel component.
 *
 * @example
 * ```tsx
 *     <SidePanel
 *       isVisible={isVisible}
 *       toggleVisibility={toggleVisibility}
 *     />
 * ```
 */
export default function SidePanel({
  isVisible,
  toggleVisibility,
}: Readonly<SidePanelProps>) {
  const [activePage, setActivePage] = useState(
    window.location.pathname.replace("/", "")
  ); // Track the active page
  const iconSize = 20; // Width in pixels of icons
  const navigate = useNavigate();

  function onNavClick(e: React.MouseEvent<HTMLButtonElement>) {
    const clickedPage = e.currentTarget.value;

    setActivePage(clickedPage);

    if (clickedPage === "payments" || clickedPage === "") {
      // TODO: Remove this when all pages are implemented
      navigate(`/${clickedPage}`);
    } else {
      console.log("Ignoring navigation to " + clickedPage);
    }
  }

  return (
    <div className="grow min-w-[250px] max-w-[325px] h-screen flex flex-col bg-[#FCFCFE] pt-3 items-center gap-5 font-semibold border-r border-gray-300">
      <div className="flex flex-row -ml-1 mb-4 items-center justify-between w-5/6">
        
        <img
          src={atlarSvg}
          alt="Atlar logo"
          width={40}
          className={`aspect-square `}
        />
        <button onClick={toggleVisibility}>
          <img
            src="/images/close-x.svg"
            alt="Close menu"
            width={25}
            className="hover:drop-shadow-lg"
          />
        </button>
      </div>

      <button
        onClick={onNavClick}
        className={`nav-button ${activePage === "" ? "" : "grayscale"}`}
        value=""
      >
        <img
          src={houseSvg}
          alt="House icon"
          width={iconSize}
          className="aspect-square"
        />
        <span>Home</span>
      </button>

      <button
        onClick={onNavClick}
        className={`nav-button ${activePage === "payments" ? "" : "grayscale"}`}
        value="payments"
      >
        <img
          src={paymentSvg}
          alt="Arrows icon"
          width={iconSize}
          className="aspect-square"
        />
        <span>Payments</span>
      </button>
    </div>
  );
}

/* // TODO: Add these when the pages are implemented
            <button 
                onClick={onNavClick} 
                className={`nav-button ${activePage === "cash-management" ? "" : "grayscale"}`}
                value="cash-management"> 
                <img src={bankSvg} alt="Bank icon" width={iconSize} className="aspect-square"/>
                <span>Cash management</span>
            </button>

            <button 
                onClick={onNavClick} 
                className={`nav-button ${activePage === "approvals" ? "" : "grayscale"}`}
                value="approvals"> 
                <img src={approvalSvg} alt="Approve icon" width={iconSize} className="aspect-square"/>
                <span>Approvals</span>
            </button>

            <button 
                onClick={onNavClick} 
                className={`nav-button ${activePage === "analytics" ? "" : "grayscale"}`}
                value="analytics"> 
                <img src={analyticSvg} alt="Analytics icon" width={iconSize} className="aspect-square"/>
                <span>Analytics</span>
            </button>

            <span className="w-4/5 h-[1px] bg-gray-300"></span>

            <button 
                onClick={onNavClick} 
                className={`nav-button ${activePage === "settings" ? "" : "grayscale"}`}
                value="settings"> 
                <img src={settingSvg} alt="Settings icon" width={iconSize} className="aspect-square"/>
                <span>Settings</span>
            </button>
*/
