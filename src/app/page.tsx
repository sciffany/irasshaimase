"use client";

import { useState } from "react";
import Screen from "@/components/Screen";
import TitleScreen from "@/components/TitleScreen";
import { tree } from "./tree";

export default function Home() {
  const [showTitleScreen, setShowTitleScreen] = useState(true);
  const [currentScreen, setCurrentScreen] =
    useState<keyof typeof tree>("order_qn");
  const [screenHistory, setScreenHistory] = useState<(keyof typeof tree)[]>([
    "order_qn",
  ]);

  const handleStart = () => {
    setShowTitleScreen(false);
  };

  const handleBackToTitle = () => {
    setShowTitleScreen(true);
  };

  const handleNavigate = (nextKey: string) => {
    if (nextKey in tree) {
      setScreenHistory((prev) => [...prev, nextKey as keyof typeof tree]);
      setCurrentScreen(nextKey as keyof typeof tree);
    }
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  const canGoBack = screenHistory.length > 1;

  if (showTitleScreen) {
    return <TitleScreen onStart={handleStart} />;
  }

  return (
    <Screen
      screenKey={currentScreen}
      onNavigate={handleNavigate}
      onBack={handleBack}
      canGoBack={canGoBack}
      onBackToTitle={handleBackToTitle}
    />
  );
}
