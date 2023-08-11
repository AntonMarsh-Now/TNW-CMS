import Image from "next/image";
import { FC } from "react";

interface TestimonialCardPreviewProps extends Testimonial {}

const TestimonialCardPreview: FC<TestimonialCardPreviewProps> = (props) => {
  return (
    <div className="p-8 border-t w-[400px] border-gray-500 bg-black/20 rounded-3xl break-inside-avoid-column shadow-gray-800 shadow text-white">
      <div className="flex gap-4 w-auto h-auto">
        <div className="relative w-12 h-12 rounded-full">
          <Image
            src={props.user_image}
            alt=""
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h6 className="text-lg font-medium text-white">
            {props.title}
          </h6>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {props.author}
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <p className="mt-8">{props.testimonial}</p>
        <p className="italic">{props.date}</p>
      </div>
    </div>
  );
};

export default TestimonialCardPreview;
