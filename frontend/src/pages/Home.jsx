import React from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import EventCarousel from "../components/EventCarousel";

export default function Home() {
  return (
    <>
      <Header />
      <MainContent />
      <EventCarousel />
    </>
  );
}
