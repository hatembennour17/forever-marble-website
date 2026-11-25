"use client";

import NextImage, { type ImageProps } from "next/image";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultPhotos, type Photo } from "@/app/lib/photo-catalog";

const PhotoContext = createContext<Photo[]>(defaultPhotos);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState(defaultPhotos);
  useEffect(() => {
    const controller = new AbortController();
    function refresh() {
      fetch("/.netlify/functions/photos", { cache: "no-store", signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((data) => { if (Array.isArray(data.photos)) setPhotos(data.photos); })
        .catch(() => { /* Keep the original images if storage is unavailable. */ });
    }
    refresh();
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  return <PhotoContext.Provider value={photos}>{children}</PhotoContext.Provider>;
}

export function usePhotos() { return useContext(PhotoContext); }

export default function ManagedImage(props: ImageProps) {
  const photos = usePhotos();
  const photo = typeof props.src === "string" ? photos.find((item) => item.originalSrc === props.src) : undefined;
  return <NextImage {...props} src={photo?.src || props.src} alt={photo && (photo.src !== photo.originalSrc || photo.alt !== defaultPhotos.find((item) => item.id === photo.id)?.alt) ? photo.alt : props.alt} unoptimized />;
}
