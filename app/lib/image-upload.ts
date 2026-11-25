export async function imagePayload(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 15 * 1024 * 1024)
    throw new Error("Choose a JPG, PNG or WebP photo up to 15 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) { bitmap.close(); throw new Error("This browser cannot prepare photos. Please try another browser."); }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = false;
  for (let index = 3; index < pixels.length; index += 4) { if (pixels[index] < 255) { transparent = true; break; } }
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Unable to prepare photo")), transparent ? "image/png" : "image/jpeg", .88));
  if (blob.size > 3 * 1024 * 1024) throw new Error("This photo is still too large. Please choose a smaller image.");
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(blob);
  });
}

