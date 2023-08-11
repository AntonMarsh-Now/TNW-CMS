import { FC } from "react";

interface HeaderSectionProps {
  image?: string;
  height?: string;
  title: string;
  description?: string;
  buttonVisible?: boolean;
}

const HeaderSection: FC<HeaderSectionProps> = ({
  image,
  height = "60vh",
  title,
  description,
  buttonVisible = false,
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        height: height,
      }}
      className="relative to-transparent bg-gradient-to-b bg-center bg-cover mb-20 mx- rounded-b-3xl overflow-hidden text-white"
    >
      <div
        className="absolute z-0 w-full h-full"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      ></div>
      <div className="absolute h-full w-full flex flex-col items-center justify-center z-10 space-y-5 px-5">
        <div className="text-5xl text-center md:text-6xl lg:text-7xl font-bold">
          {title}
        </div>
        <div className="text-lg lg:text-2xl max-w-3xl text-center">
          {description}
        </div>
        {buttonVisible && (
          <div className="buttonBlur p-3 hover:cursor-pointer">
            <div className="md:text-xl lg:text-2xl">Plan With A Specialist</div>
          </div>
        )}
      </div>
      {/* <div className="imageBlend w-full h-10 bottom-0 absolute"></div> */}
    </div>
  );
};

export default HeaderSection;
