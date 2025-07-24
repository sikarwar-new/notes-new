import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import data from "../../db/data";
import ProductCard from "../../Components/ProductCard";
import { NavLink } from "react-router-dom";
import Particles from "../../Components/Particles";

function HomePostLogIn() {
  const { user } = useAuth();

  const accessedResources = data
    .filter((resource) => user.resourcesAccessed?.includes(resource.title))
    .slice(0, 4);

  const shuffled = [...data].sort(() => 0.5 - Math.random());
  const randomNotes = shuffled.slice(0, 4);

  return (
    <div className="mt-15 px-6 py-10 min-h-screen text-gray-800 w-[90%] mx-auto">
      <Particles />
      <h1 className="text-4xl font-semibold text-center mb-12">
        Welcome back, <span className="text-orange-500">{user.userName}</span>{" "}
        👋
      </h1>

      <section className="mb-16 bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Notes</h2>
          {user.uploadApprove === "yes" ? (
            <span className="text-sm text-green-600">Upload Approved</span>
          ) : (
            <span className="text-sm text-gray-500">No uploads yet</span>
          )}
        </div>

        {accessedResources.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-300">
            {accessedResources.map((note, index) => (
              <div key={`accessed-${index}`} className="flex-shrink-0 w-64">
                <ProductCard
                  title={note.title}
                  subject={note.branch}
                  numRatings={note.reviews}
                  price={note.newPrice}
                  btn="Start Reading"
                  isBought={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No accessed notes yet.</p>
        )}
      </section>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between text-white shadow-md mt-12 mb-12">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-semibold mb-1">
            Looking for helpful notes or study kits?
          </h2>
          <p className="text-gray-300 text-sm">
            Browse the Resources section to boost your learning.
          </p>
        </div>
        <NavLink
          to="/resources"
          className="bg-white text-gray-900 font-medium px-5 py-2 rounded-md shadow hover:bg-gray-100 transition"
        >
          Explore Resources
        </NavLink>
      </div>

      <section className="mb-16 bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
        <h2 className="text-2xl font-semibold mb-6">Notes For You</h2>
        <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-300">
          {randomNotes.map((note, index) => (
            <div key={`random-${index}`} className="flex-shrink-0 w-64">
              <ProductCard
                title={note.title}
                subject={note.branch}
                numRatings={note.reviews}
                price={note.newPrice}
                btn="Add to Cart"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
        <h2 className="text-2xl font-semibold mb-4">Learning Kits</h2>
        <p className="text-gray-600 text-sm mb-6">
          Explore our curated study kits for better semester planning.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            title="One Year Kit"
            subject="All Subjects"
            numRatings={403}
            price={400}
            btn="Add to Cart"
          />
          <ProductCard
            title="One Semester Kit"
            subject="All Subjects"
            numRatings={403}
            price={220}
            btn="Add to Cart"
          />
        </div>
      </section>
    </div>
  );
}

export default HomePostLogIn;
