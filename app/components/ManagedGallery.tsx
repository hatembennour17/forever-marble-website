"use client";

import Image from "next/image";
import { usePhotos } from "./ManagedImage";

export default function ManagedGallery() {
  const photos = usePhotos().filter((photo) => photo.section === "gallery" && !photo.hidden)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return <div className="shell legacy-gallery-grid">{photos.map((photo, index) => (
    <figure className="legacy-gallery-card" key={photo.id}>
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 50vw, 33vw" priority={index < 3} unoptimized />
    </figure>
  ))}</div>;
}
