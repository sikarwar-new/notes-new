import React from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";

import Navbar from "../../Components/Navbar.jsx";
import Hero from "./Hero";
import ChooseUs from "./ChooseUs";
import Rest from "./Rest";
import Footer from "../../Components/Footer.jsx";
import FAQList from "./FAQList";
import HomePostLogIn from "../misc/HomePostLogIn";

function Home() {
  const { user, loggedIn, loading } = useAuth();

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      {loggedIn ? (
        <HomePostLogIn user={user} />
      ) : (
        <>
          <Hero />
          <Rest />
          <ChooseUs />
          <FAQList />
        </>
      )}
      <Footer />
    </>
  );
}

export default Home;
