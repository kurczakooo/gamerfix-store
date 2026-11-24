import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Checkbox,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  Textarea,
  toast,
  useDataTable,
} from "@medusajs/ui";
import { ListCheckbox, Star, StarSolid } from "@medusajs/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { sdk } from "../../lib/sdk";

type ToDoTask = {
  id: string;
  content: string;
  important: boolean;
  done: boolean;
  deleted: boolean;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
};

const emptyForm = {
  content: "",
  important: false,
};

const TASKS_PER_PAGE = 10;

type TodosResponse = {
  todos: ToDoTask[];
  count: number;
  limit: number;
  offset: number;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const ToDoPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: TASKS_PER_PAGE,
    pageIndex: 0,
  });

  const { data, isLoading } = useQuery<TodosResponse>({
    queryFn: () =>
      sdk.client.fetch("/admin/todo", {
        query: {
          limit: 1000,
          offset: 0,
        },
      }),
    queryKey: ["todos"],
    refetchOnMount: "always",
  });

  const visibleTasks = (data?.todos || [])
    .filter((task) => !task.deleted)
    .sort((firstTask, secondTask) => {
      const getPriority = (task: ToDoTask) =>
        task.done ? 2 : task.important ? 0 : 1;

      return getPriority(firstTask) - getPriority(secondTask);
    });
  const pageStart = pagination.pageIndex * pagination.pageSize;
  const paginatedTasks = visibleTasks.slice(
    pageStart,
    pageStart + pagination.pageSize,
  );

  const columnHelper = createDataTableColumnHelper<ToDoTask>();
  const paginationTable = useDataTable({
    columns: [
      columnHelper.accessor("id", {
        header: "ID",
      }),
    ],
    data: visibleTasks,
    getRowId: (task) => task.id,
    rowCount: visibleTasks.length,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = form.content.trim().slice(0, 2048);

    if (!content) {
      toast.error("Task content is required");
      return;
    }

    try {
      if (editingId) {
        await sdk.client.fetch(`/admin/todo/${editingId}`, {
          method: "PATCH",
          body: {
            content,
            important: form.important,
          },
        });
        toast.success("Task updated");
      } else {
        await sdk.client.fetch("/admin/todo", {
          method: "POST",
          body: {
            content,
            important: form.important,
          },
        });
        setPagination((currentPagination) => ({
          ...currentPagination,
          pageIndex: 0,
        }));
        toast.success("Task added");
      }

      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      resetForm();
    } catch (error) {
      toast.error(editingId ? "Failed to update task" : "Failed to add task");
    }
  };

  const updateTask = async (
    id: string,
    changes: Partial<Pick<ToDoTask, "important" | "done">>,
  ) => {
    try {
      await sdk.client.fetch(`/admin/todo/${id}`, {
        method: "PATCH",
        body: changes,
      });
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (task: ToDoTask) => {
    try {
      await sdk.client.fetch(`/admin/todo/${task.id}`, {
        method: "DELETE",
      });
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (editingId === task.id) {
        resetForm();
      }
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task: ToDoTask) => {
    setEditingId(task.id);
    setForm({ content: task.content, important: task.important });
  };

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading>To-do list</Heading>
      </div>

      <div className="px-6 py-6">
        <form
          className="bg-ui-bg-subtle flex flex-col gap-4 rounded-lg border p-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label
              className="text-ui-fg-base txt-small-plus"
              htmlFor="task-content"
            >
              {editingId ? "Edit task" : "New task"}
            </label>
            <Textarea
              id="task-content"
              maxLength={2048}
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              placeholder="What needs to be done?"
              rows={3}
            />
            <span className="text-ui-fg-subtle text-xs">
              {form.content.length}/2048 characters
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-ui-fg-base flex items-center gap-2 txt-small-plus">
              <Checkbox
                checked={form.important}
                onCheckedChange={(checked) =>
                  setForm({ ...form, important: !!checked })
                }
              />
              Mark as important
            </label>
            <div className="flex gap-2">
              {editingId && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {editingId ? "Save changes" : "Add task"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-ui-border-base" />

      <div className="flex flex-col gap-3 px-6 pb-0 pt-6">
        {isLoading ? (
          <p className="text-ui-fg-subtle py-8 text-center">Loading tasks...</p>
        ) : visibleTasks.length === 0 ? (
          <p className="text-ui-fg-subtle py-8 text-center">No tasks yet.</p>
        ) : (
          paginatedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-ui-border-base bg-ui-bg-subtle px-4 py-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Checkbox
                  checked={task.done}
                  aria-label={`Mark task as ${task.done ? "not done" : "done"}`}
                  onCheckedChange={(checked) =>
                    updateTask(task.id, { done: !!checked })
                  }
                />
                <button
                  type="button"
                  className="shrink-0 text-yellow-500 transition-colors hover:text-yellow-600"
                  aria-label={
                    task.important
                      ? "Remove important flag"
                      : "Mark task as important"
                  }
                  aria-pressed={task.important}
                  title={
                    task.important
                      ? "Remove important flag"
                      : "Mark task as important"
                  }
                  onClick={() =>
                    updateTask(task.id, { important: !task.important })
                  }
                >
                  {task.important ? (
                    <StarSolid className="size-5 text-yellow-500" />
                  ) : (
                    <Star className="size-5 text-yellow-500" />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={
                      task.done
                        ? "text-ui-fg-subtle line-through text-sm"
                        : "text-sm"
                    }
                  >
                    {task.content}
                  </p>
                  <p className="text-ui-fg-subtle mt-1 text-xs">
                    Created {formatDate(task.created_at)}
                    {task.important && " · Important"}
                  </p>
                </div>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleDelete(task)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}

        {visibleTasks.length > 0 && (
          <DataTable instance={paginationTable}>
            <DataTable.Pagination />
          </DataTable>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "To-do list",
  icon: ListCheckbox,
});

export default ToDoPage;
