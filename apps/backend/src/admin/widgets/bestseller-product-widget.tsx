import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types";
import { Checkbox, Container, Heading, Label, toast } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../lib/sdk";

const TAGS = [
  { id: "bestseller", label: "Bestseller" },
  { id: "new", label: "Nowość" },
  { id: "lastItems", label: "Ostatnie Sztuki" },
] as const;

type TagId = (typeof TAGS)[number]["id"];

const isTagSet = (value: unknown) => value === true || value === "true";

const ProductThumbnailTagsWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();
  const [checkedTags, setCheckedTags] = useState<Record<TagId, boolean>>({
    bestseller: isTagSet(data.metadata?.bestseller),
    new: isTagSet(data.metadata?.new),
    lastItems: isTagSet(data.metadata?.lastItems),
  });

  const handleTagToggle = async (
    id: TagId,
    checked: boolean | "indeterminate",
  ) => {
    const next = checked === true;
    setCheckedTags((current) => ({ ...current, [id]: next }));

    try {
      // Spreading the current tag state keeps a stale data.metadata from reverting other tags.
      await sdk.admin.product.update(data.id, {
        metadata: { ...data.metadata, ...checkedTags, [id]: next },
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      setCheckedTags((current) => ({ ...current, [id]: !next }));
      toast.error("Failed to update thumbnail tag");
    }
  };

  const tags = TAGS.map((tag) => ({
    ...tag,
    checked: checkedTags[tag.id],
    onChange: (checked: boolean | "indeterminate") =>
      handleTagToggle(tag.id, checked),
  }));

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product thumbnail tags</Heading>
      </div>
      <div className="flex flex-col gap-3 px-6 py-4">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-3">
            <Checkbox
              id={`tag-${tag.id}`}
              checked={tag.checked}
              onCheckedChange={tag.onChange}
            />
            <Label htmlFor={`tag-${tag.id}`}>{tag.label}</Label>
          </div>
        ))}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default ProductThumbnailTagsWidget;
