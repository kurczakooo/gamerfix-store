import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Input, Text, toast } from "@medusajs/ui";
import { Photo } from "@medusajs/icons";
import { useEffect, useState, type ChangeEvent } from "react";
import { optimizeImage } from "../../utils/optimize-image";

export default function ImageTestPage() {
  const [original, setOriginal] = useState<File | null>(null);
  const [optimized, setOptimized] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [optimizedPreview, setOptimizedPreview] = useState<string | null>(null);

  // Optional optimization settings
  const [maxSize, setMaxSize] = useState("");
  const [quality, setQuality] = useState("");

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate max size if provided
    if (maxSize) {
      const parsedMaxSize = Number(maxSize);

      if (!Number.isFinite(parsedMaxSize) || parsedMaxSize <= 0) {
        toast.error("Invalid max size", {
          description: "Max size must be a positive number.",
        });

        return;
      }
    }

    // Validate quality if provided
    if (quality) {
      const parsedQuality = Number(quality);

      if (
        !Number.isFinite(parsedQuality) ||
        parsedQuality <= 0 ||
        parsedQuality > 100
      ) {
        toast.error("Invalid quality", {
          description: "Quality must be between 1 and 100.",
        });

        return;
      }
    }

    setOriginal(file);
    setOptimized(null);
    setLoading(true);

    // Create preview for original image
    const originalUrl = URL.createObjectURL(file);
    setOriginalPreview(originalUrl);

    // Clear previous optimized preview
    if (optimizedPreview) {
      URL.revokeObjectURL(optimizedPreview);
      setOptimizedPreview(null);
    }

    try {
      // Build optional parameters
      const options: {
        maxResolution?: number;
        quality?: number;
      } = {};

      if (maxSize) {
        options.maxResolution = Number(maxSize);
      }

      if (quality) {
        // Convert percentage (80) to decimal (0.8)
        options.quality = Number(quality) / 100;
      }

      const result = await optimizeImage(file, options.maxResolution, options.quality);

      setOptimized(result);

      // Create preview for optimized image
      const optimizedUrl = URL.createObjectURL(result);
      setOptimizedPreview(optimizedUrl);

      toast.success("Image optimized", {
        description: "The image has been successfully optimized.",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to optimize image", {
        description: "Something went wrong while optimizing the image.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!optimized) {
      return;
    }

    const url = URL.createObjectURL(optimized);

    const link = document.createElement("a");

    link.href = url;
    link.download = optimized.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (originalPreview) {
        URL.revokeObjectURL(originalPreview);
      }

      if (optimizedPreview) {
        URL.revokeObjectURL(optimizedPreview);
      }
    };
  }, [originalPreview, optimizedPreview]);

  return (
    <Container className="divide-y p-0">
      {/* Header */}
      <div className="px-6 py-4">
        <Heading>Image optimizer test</Heading>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* Settings */}
        <div className="flex flex-col gap-4 rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4">
          <div>
            <Heading level="h2">Optimization settings</Heading>

            <Text size="small" className="mt-1 text-ui-fg-subtle">
              Leave a field empty to use the default value.
            </Text>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Max size */}
            <div className="flex flex-col gap-2">
              <Text size="small" weight="plus">
                Max size
              </Text>

              <Input
                type="number"
                min={1}
                placeholder="2500"
                value={maxSize}
                onChange={event => setMaxSize(event.target.value)}
                disabled={loading}
              />

              <Text size="small" className="text-ui-fg-subtle">
                Maximum width or height in pixels. Default: 2500px.
              </Text>
            </div>

            {/* Quality */}
            <div className="flex flex-col gap-2">
              <Text size="small" weight="plus">
                Quality
              </Text>

              <Input
                type="number"
                min={1}
                max={100}
                step={1}
                placeholder="80"
                value={quality}
                onChange={event => setQuality(event.target.value)}
                disabled={loading}
              />

              <Text size="small" className="text-ui-fg-subtle">
                WebP quality from 1 to 100%. Default: 80%.
              </Text>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-2">
          <Text size="small" weight="plus">
            Select an image
          </Text>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={loading}
            className="block w-full max-w-md cursor-pointer rounded-md border border-ui-border-base bg-ui-bg-base p-2 text-sm"
          />

          <Text size="small" className="text-ui-fg-subtle">
            Select an image after changing the settings.
          </Text>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4">
            <Text size="small">Optimizing image...</Text>
          </div>
        )}

        {/* Images preview */}
        {(originalPreview || optimizedPreview) && (
          <div>
            <Heading level="h2" className="mb-4">
              Preview
            </Heading>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Original */}
              {originalPreview && original && (
                <div className="overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle">
                  <div className="border-b border-ui-border-base px-4 py-3">
                    <Heading level="h3">Original image</Heading>
                  </div>

                  <div className="p-4">
                    <div className="mb-4 flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg bg-ui-bg-base">
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="max-h-[500px] max-w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Text size="small">
                        <strong>Filename:</strong> {original.name}
                      </Text>

                      <Text size="small">
                        <strong>Size:</strong>{" "}
                        {(original.size / 1024 / 1024).toFixed(2)} MB
                      </Text>

                      <Text size="small">
                        <strong>Type:</strong> {original.type}
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimized */}
              {optimizedPreview && optimized && (
                <div className="overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle">
                  <div className="border-b border-ui-border-base px-4 py-3">
                    <Heading level="h3">Optimized image</Heading>
                  </div>

                  <div className="p-4">
                    <div className="mb-4 flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg bg-ui-bg-base">
                      <img
                        src={optimizedPreview}
                        alt="Optimized"
                        className="max-h-[500px] max-w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Text size="small">
                        <strong>Filename:</strong> {optimized.name}
                      </Text>

                      <Text size="small">
                        <strong>Size:</strong>{" "}
                        {(optimized.size / 1024 / 1024).toFixed(2)} MB
                      </Text>

                      <Text size="small">
                        <strong>Type:</strong> {optimized.type}
                      </Text>

                      {original && (
                        <Text size="small">
                          <strong>Reduction:</strong>{" "}
                          {((1 - optimized.size / original.size) * 100).toFixed(1)}%
                        </Text>
                      )}
                    </div>

                    {/* Download */}
                    <div className="mt-6 border-t border-ui-border-base pt-4">
                      <Button type="button" onClick={handleDownload}>
                        Download optimized image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Image optimizer",
  icon: Photo,
});
