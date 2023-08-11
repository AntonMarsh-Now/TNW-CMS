import { FC } from "react";

interface HeroProps {
  image?: string;
  title1?: string;
  title2?: string;
  buttonVisible?: boolean;
  children?: React.ReactNode;
  imageHeight?: string;
}

const Hero: FC<HeroProps> = ({
  image,
  title1 = "LUXURY",
  title2 = "DESTINATIONS",
  buttonVisible = true,
  children,
  imageHeight = "70vh",
}) => {
  return (
    <div
      className="relative to-transparent bg-gradient-to-b bg-center bg-cover"
      style={{
        backgroundImage: `url(${image})`,
        height: imageHeight,
      }}
    >
      <div
        className="absolute z-0 w-full h-full"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      ></div>
      <div className="absolute z-10 text-white h-full w-full">
        {children ? (
          children
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col w-full items-center lg:items-end px-20">
              <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl md:text-center lg:text-end font-bold">
                {title1}
              </div>
              <div className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-end font-bold">
                {title2}
              </div>
              {buttonVisible && (
                <div className="bg-trippitBlue p-4 rounded-xl mt-10">
                  <div className="md:text-xl lg:text-2xl">
                    Plan With A Specialist
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="imageBlend w-full h-32 bottom-0 absolute"></div>
    </div>
  );
};

export default Hero;
