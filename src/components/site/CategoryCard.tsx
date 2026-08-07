import Link from "next/link";
import Image from "next/image";
import type { Category } from "@prisma/client";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-lg">
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      ) : (
        <div className="h-full w-full bg-neutral-200" />
      )}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition" />
      <span className="absolute bottom-6 left-6 font-heading text-white text-2xl tracking-wide">
        {category.name}
      </span>
    </Link>
  );
}
