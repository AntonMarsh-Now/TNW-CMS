import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface BlogCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
}

const BlogCard: FC<BlogCardProps> = ({
  image,
  title,
  description,
  href,
}) => {
  return (
    <Link
      href={href}
      className="p-5 w-full rounded-3xl relative overflow-hidden flex flex-col items-center justify-center bg-black/20 shadow shadow-gray-800 border-t border-gray-600"
    >
      <div className="space-y-4">
        <div className="relative w-full h-40 rounded-3xl overflow-hidden">
          <Image src={image} alt="" fill objectFit="cover" />
        </div>
        <div className="">
          <div className="text-center sm:text-2xl lg:text-lg xl:text-xl font-medium">
            {title}
          </div>
          <div className="flex sm:text-lg lg:text-sm items-center justify-center">
            <div className="border-r border-white pr-2">By Travelong</div>
            <div className="pl-2">Our Blog</div>
          </div>
        </div>
        <div className="text-center xl:text-sm">
          {description} <span>Read More.</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;