import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Textarea, toast } from "@medusajs/ui";
import { DocumentText } from "@medusajs/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { sdk } from "../../lib/sdk";

const Markdown = ReactMarkdown as unknown as (props: {
  children: string;
  remarkPlugins?: unknown[];
}) => ReactNode;

type Note = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type NotesResponse = {
  note: Note;
};

export default function ImageTestPage() {
  const MAX_CONTENT_LENGTH = 1024 * 1024;

  const queryClient = useQueryClient();
  const [form, setForm] = useState({ content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useQuery<NotesResponse>({
    queryFn: () => sdk.client.fetch("/admin/notes"),
    queryKey: ["notes"],
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (data?.note && !isEditing) {
      setForm({ content: data.note.content });
    }
  }, [data, isEditing]);

  const handleSave = async () => {
    try {
      if (data?.note) {
        await sdk.client.fetch(`/admin/notes/${data.note.id}`, {
          method: "PATCH",
          body: { content: form.content },
        });
        toast.success("Notes updated");
      } else {
        await sdk.client.fetch("/admin/notes", {
          method: "POST",
          body: { content: form.content },
        });
        toast.success("Notes created");
      }

      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsEditing(false);
    } catch {
      toast.error("Failed to save notes");
      // Keep the editor open so unsaved content is not lost.
    }
  };

  return (
    <Container className="divide-y p-0">
      {/* Header */}
      <div className="px-6 py-4">
        <Heading>Notes</Heading>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {isEditing ? (
          <Textarea
            id="notes-content"
            maxLength={MAX_CONTENT_LENGTH}
            value={form.content}
            onChange={(event) =>
              setForm({ ...form, content: event.target.value })
            }
            placeholder="Write Markdown here..."
            className="h-[52rem] min-h-[40rem] resize-none font-sans text-base leading-7"
          />
        ) : (
          <div className="h-[52rem] overflow-y-auto rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 font-sans text-base leading-7 [&_a]:text-ui-fg-interactive [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-ui-border-strong [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-ui-bg-base [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-ui-bg-base [&_pre]:p-4 [&_table]:mb-4 [&_table]:w-full [&_td]:border [&_td]:border-ui-border-base [&_td]:p-2 [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-base [&_th]:p-2 [&_th]:text-left [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
            {isLoading ? (
              <p className="text-ui-fg-subtle">Loading notes...</p>
            ) : form.content ? (
              <Markdown remarkPlugins={[remarkGfm]}>{form.content}</Markdown>
            ) : (
              <p className="text-ui-fg-subtle">
                Click edit and write something...
              </p>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button type="submit" disabled={!isEditing} onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Notes & Instructions",
  icon: DocumentText,
});
