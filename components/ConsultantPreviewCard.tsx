import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ConsultantPreviewCardProps {
  consultant: Consultant;
  href: string;
}

const ConsultantPreviewCard: FC<ConsultantPreviewCardProps> = ({
  consultant,
  href,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col w-full items-center border p-3 rounded-lg space-y-3 hover:cursor-pointer w-fit"
    >
      <div className="relative h-40 w-full rounded-lg overflow-hidden">
        <Image src={consultant.image} alt="" fill objectFit="cover" />
      </div>
      <div>{consultant.name}</div>
    </Link>
  );
};

export default ConsultantPreviewCard;
