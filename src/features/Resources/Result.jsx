import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../Components/ProductCard";
import data from "../../db/data";

function Result() {
  const query = new URLSearchParams(useLocation().search);
  const year = query.get("year") || "";
  const branch = query.get("branch") || "";
  const semester = query.get("semester") || "";

  const filteredResults = React.useMemo(() => {
    const lowerYear = year.toLowerCase();
    const semesterNumber = semester.match(/\d+/)?.[0];

    return data.filter((item) => {
      const itemBranch = item.branch?.toLowerCase() || "";
      const itemYear = item.year?.toLowerCase() || "";

      // If 1st year selected, show all 1st year resources, no branch/semester needed
      if (lowerYear === "1st") {
        return itemYear.includes("1"); // You can customize this condition
      }

      // Otherwise, match by branch and semester
      return (
        itemBranch === branch.toLowerCase() &&
        (semesterNumber ? itemYear.includes(semesterNumber) : false)
      );
    });
  }, [year, branch, semester]);

  const handleAddToCart = (course) => {
    console.log("Add to cart clicked for:", course.title);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <h2 className="mt-15 text-3xl font-bold text-center mb-8">
        {year.toLowerCase() === "1st"
          ? `Results for 1st Year`
          : branch
          ? semester
            ? `Results for ${branch} - ${semester}`
            : `Results for ${branch}`
          : "Please select branch and semester"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredResults.length > 0 ? (
          filteredResults.map((course, index) => (
            <ProductCard
              key={index}
              title={course.title}
              subject={course.subject || "General"}
              numRatings={course.reviews}
              price={course.newPrice}
              btn={"Add to Cart"}
              onAddToCart={() => handleAddToCart(course)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              {year.toLowerCase() === "1st"
                ? "No resources found for 1st Year"
                : branch
                ? `No resources found for ${branch}${
                    semester ? ` - ${semester}` : ""
                  }`
                : "Please select both branch and semester to view resources"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
