type ImageFormat =
  | "heif"
  | "image/avif"
  | "image/gif"
  | "image/jpeg"
  | "image/png"
  | "image/webp";

function matchesBytes(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(offset, offset + length));
}

async function detectImageFormat(file: Blob): Promise<ImageFormat | null> {
  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer());

  if (matchesBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (matchesBytes(bytes, [0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }

  const header = readAscii(bytes, 0, 6);
  if (header === "GIF87a" || header === "GIF89a") {
    return "image/gif";
  }
  if (readAscii(bytes, 0, 4) === "RIFF" && readAscii(bytes, 8, 4) === "WEBP") {
    return "image/webp";
  }

  if (readAscii(bytes, 4, 4) === "ftyp") {
    const boxLength = new DataView(bytes.buffer).getUint32(0);
    const brands = [readAscii(bytes, 8, 4)];

    for (
      let offset = 16;
      offset + 4 <= Math.min(boxLength, bytes.length);
      offset += 4
    ) {
      brands.push(readAscii(bytes, offset, 4));
    }

    if (brands.some((brand) => brand === "avif" || brand === "avis")) {
      return "image/avif";
    }
    if (
      brands.some((brand) =>
        [
          "heic",
          "heix",
          "hevc",
          "hevx",
          "heim",
          "heis",
          "hevm",
          "hevs",
          "mif1",
          "msf1",
        ].includes(brand),
      )
    ) {
      return "heif";
    }
  }

  return null;
}

async function loadImage(source: Blob): Promise<{
  image: HTMLImageElement;
  url: string;
}> {
  const url = URL.createObjectURL(source);
  const image = new Image();

  try {
    image.src = url;
    await image.decode();

    return { image, url };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export async function prepareImageForBrowser(file: File): Promise<File> {
  const format = await detectImageFormat(file);
  const source =
    format && format !== "heif"
      ? new Blob([file], { type: format })
      : format === "heif"
        ? new Blob([file], { type: "image/heic" })
        : file;

  if (format === "heif") {
    try {
      const decoded = await loadImage(source);
      URL.revokeObjectURL(decoded.url);
      return new File([source], file.name, { type: source.type });
    } catch {
      const { heicTo } = await import("heic-to");
      const converted = await heicTo({
        blob: file,
        type: "image/png",
      });

      return new File([converted], file.name, { type: "image/png" });
    }
  }

  return new File([source], file.name, { type: source.type });
}

export async function optimizeImage(
  file: File,
  maxResolution?: number,
  quality?: number,
): Promise<File> {
  const source = await prepareImageForBrowser(file);
  const decoded = await loadImage(source);

  try {
    const { image } = decoded;
    const maxSize = maxResolution || 2500;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

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

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
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

    const filename = file.name.replace(/\.[^/.]+$/, "") + ".webp";

    return new File([blob], filename, {
      type: "image/webp",
    });
  } finally {
    URL.revokeObjectURL(decoded.url);
  }
}
