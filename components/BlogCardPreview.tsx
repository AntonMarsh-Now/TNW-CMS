import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface BlogCardPreviewProps {
  image: string;
  title: string;
  description: string;
  href: string;
}

const BlogCardPreview: FC<BlogCardPreviewProps> = ({
  image,
  title,
  description,
  href,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col w-full items-center border p-3 rounded-lg space-y-3 group"
    >
      <div className="relative h-40 w-full rounded-lg overflow-hidden">
        <Image src={image} alt="" fill objectFit="cover" className="group-hover:scale-110 transition-all duration-300" />
      </div>
      <div className="max-w-[240px] flex flex-col items-center justify-center space-y-5">
        <div className="text-center font-bold">{title}</div>
        <div className="text-center">{description}</div>
      </div>
    </Link>
  );
};

export default BlogCardPreview;
