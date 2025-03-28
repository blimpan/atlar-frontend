import SidePanel from "../components/SidePanel";
import CurrentTotalBalance from "../components/CurrentTotalBalance";
import TotalBalanceGraph from "../components/TotalBalanceGraph";
import AccountsList from "../components/AccountsList";
import { useState } from "react";
import AlertsOverview from "../components/AlertsOverview";

export default function Home() {
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);

  function updateTargetCurrency(newTarget: string) {
    setTargetCurrency(newTarget);
  }

  function onTogglePanel() {
    setShowSidePanel(!showSidePanel);
  }

  return (
    <div className="flex w-full h-full">
      <div
        className={`flex left-0 max-w-max transform transition-transform duration-200 ease-in-out ${
          showSidePanel ? "translate-x-0" : "-translate-x-[110%]"
        } `}
      >
        {showSidePanel && (
          <SidePanel
            isVisible={showSidePanel}
            toggleVisibility={onTogglePanel}
          />
        )}
      </div>

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row w-full h-fit border-b border-gray-300">
          {" "}
          {/* Header */}
          {!showSidePanel && (
            <button
              className="mx-4 my-1.5 px-2 border rounded-lg border-gray-300 flex flex-row items-center gap-2 font-semibold hover:shadow-sm"
              onClick={onTogglePanel}
            >
              <img
                src="/images/show-sidepanel.svg"
                alt="Side panel"
                width={30}
              />
              Menu
            </button>
          )}
          <p className="font-semibold p-4">Home</p>
        </div>

        <div className="flex flex-col w-full h-full gap-4 p-4 fade-in">
          {" "}
          {/* Widgets */}
          <div className="flex flex-row gap-4 w-full h-full">
            <div className="flex flex-col min-w-fit h-full gap-4">
              <CurrentTotalBalance
                setCurrency={updateTargetCurrency}
                currentCurrency={targetCurrency}
              />
              <AlertsOverview />
            </div>

            <TotalBalanceGraph
              setCurrency={updateTargetCurrency}
              currentCurrency={targetCurrency}
            />
          </div>
          <div className="flex flex-row">
            <AccountsList
              setCurrency={updateTargetCurrency}
              currentCurrency={targetCurrency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
