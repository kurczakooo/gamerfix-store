export async function optimizeImage(
  file: File,
  maxResolution?: number,
  quality?: number,
): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const maxSize = maxResolution || 2500;

  let width = bitmap.width;
  let height = bitmap.height;

  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);

    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context");
  }

  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      result => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Could not convert image to WebP"));
        }
      },
      "image/webp",
      quality || 0.8,
    );
  });

  bitmap.close();

  const filename = file.name.replace(/\.[^/.]+$/, "") + ".webp";

  return new File([blob], filename, {
    type: "image/webp",
  });
}
