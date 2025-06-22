import GradientText from "@/components/effects/gradientText";
import RotatingText from "@/components/effects/RotateText";
import TrendingCarousel from "@/components/Main/trending/Carousel";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
      <TrendingCarousel />
        <div className="p-4 pb-16">
          <div className="flex gap-2 text-[2rem] items-center mt-4 mb-4">
            Top content on
            <RotatingText
              texts={["Netflix", "HBO", "Amazon Prime", "Apple watch"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-red-500 text-white text-md overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
