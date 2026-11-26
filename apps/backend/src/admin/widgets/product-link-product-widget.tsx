import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types";
import { Button, Container, Heading, Input, Label, toast } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../lib/sdk";

const MAX_LENGTH = 512;

const FIELDS = [
  {
    key: "otherProductLinkCTA",
    label: "Call to action for other product",
  },
  {
    key: "otherProductLinkUrl",
    label: "URL to linked product",
  },
  {
    key: "otherProductLinkButtonText",
    label: "Text on the button that takes to the linked product",
  },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

const readValue = (value: unknown) => (typeof value === "string" ? value : "");

const OtherProductLinkWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    otherProductLinkCTA: readValue(data.metadata?.otherProductLinkCTA),
    otherProductLinkUrl: readValue(data.metadata?.otherProductLinkUrl),
    otherProductLinkButtonText: readValue(
      data.metadata?.otherProductLinkButtonText,
    ),
  });
  const [exists, setExists] = useState(
    FIELDS.every((field) => readValue(data.metadata?.[field.key]) !== ""),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const allFilled = FIELDS.every((field) => values[field.key].trim() !== "");

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const trimmed = Object.fromEntries(
        FIELDS.map((field) => [field.key, values[field.key].trim()]),
      ) as Record<FieldKey, string>;

      await sdk.admin.product.update(data.id, {
        metadata: { ...data.metadata, ...trimmed },
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setValues(trimmed);
      setExists(true);
      setIsEditing(false);
      toast.success("Other product link saved");
    } catch {
      toast.error("Failed to save other product link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);

    try {
      await sdk.admin.product.update(data.id, {
        metadata: {
          ...data.metadata,
          otherProductLinkCTA: "",
          otherProductLinkUrl: "",
          otherProductLinkButtonText: "",
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setValues({
        otherProductLinkCTA: "",
        otherProductLinkUrl: "",
        otherProductLinkButtonText: "",
      });
      setExists(false);
      setIsEditing(false);
      toast.success("Other product link deleted");
    } catch {
      toast.error("Failed to delete other product link");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Other product link</Heading>
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={values[field.key]}
              maxLength={MAX_LENGTH}
              disabled={!isEditing || isSaving}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
            />
          </div>
        ))}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isEditing || isSaving}
              onClick={() => setIsEditing(true)}
            >
              {exists ? "Edit" : "Create"}
            </Button>
            <Button
              type="button"
              disabled={!isEditing || !allFilled || isSaving}
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
          {exists && (
            <Button
              type="button"
              variant="danger"
              disabled={isSaving}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default OtherProductLinkWidget;
