import Hero from "@/components/HeroPreview";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface ConsultantPreview extends Consultant {
  defaultImage: string;
  defaultBackgroundImage: string;
  defaultSecondaryImage: string;
}

export const ConsultantPreview: FC<ConsultantPreview> = ({ ...props }) => {
  const formatAbout = (about: string) => {
    return about && about.split("\n").map((paragraph, i) => (
      <p key={i} className="mb-5">
        {paragraph}
      </p>
    ));
  };

  return (
    <>
      <Hero
        image={
          props.background_image
            ? props.background_image
            : props.defaultBackgroundImage
        }
        imageHeight="50vh"
      >
        <div className="absolute w-full flex flex-col lg:flex-row items-center justify-between sm:px-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-10 lg:space-y-0">
          <div className="flex items-center space-x-10">
            <div className="relative h-40 w-40 rounded-full overflow-hidden">
              <Image
                src={props.image ? props.image : props.defaultImage}
                alt=""
                objectFit="cover"
                fill
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="font-bold text-2xl">{props.name}</div>
              <div className="text-xs sm:text-sm">{props.phone}</div>
              <div className="underline text-blue-500 text-xs">
                {props.email}
              </div>
              <div className="font-medium text-xs">{props.role}</div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} color="rgb(63 131 248)" />
                <div className="font-medium text-xs">{props.location}</div>
              </div>
            </div>
          </div>
          <div className="lg:h-60 flex lg:flex-col items-baseline lg:items-center space-x-5 lg:space-x-0 lg:justify-between">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-green-400 rounded-xl px-5 py-3 flex items-center justify-center">
                Available now
              </div>
              <div>20 Reviews</div>
            </div>
            <div className="bg-trippitBlue rounded-xl px-5 py-3 flex items-center justify-center">
              Get In Touch
            </div>
          </div>
        </div>
      </Hero>
      <div className="container mb-10 bg-previewBg text-white">
        <div className="font-bold underline text-2xl mb-5">About Me</div>
        <div>{formatAbout(props.about)}</div>
      </div>
      <Hero
        image={
          props.secondary_image
            ? props.secondary_image
            : props.defaultSecondaryImage
        }
        imageHeight="80vh"
      >
        <div className="imageBlend2 w-full h-32 top-0 absolute"></div>
        <div className="container flex flex-col justify-between my-32 space-y-20">
          <div>
            <div className="font-bold underline text-3xl mb-5">
              Specialities
            </div>
            <ul className="list-disc">
              <div className="px-4 text-xl">
                {props.specialities.map((specialty, i) => (
                  <li key={i}>{specialty}</li>
                ))}
              </div>
            </ul>
          </div>
          <div>
            <div className="font-bold underline text-3xl mb-5">Top Review</div>
            <div className="italic">
              {props.top_review.content}
              <br />
              <br />
              <span className="not-italic">- {props.top_review.by}.</span>
            </div>
          </div>
        </div>
      </Hero>
    </>
  );
};
