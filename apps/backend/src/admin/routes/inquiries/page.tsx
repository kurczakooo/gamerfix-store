import { defineRouteConfig } from "@medusajs/admin-sdk";
import { EllipsisHorizontal, MessagePlus, Trash } from "@medusajs/icons";
import {
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  DropdownMenu,
  IconButton,
  toast,
  Checkbox,
} from "@medusajs/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useMemo, useState } from "react";

type Inquiry = {
  id: string;
  handled: boolean;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  created_at: string;
};

type InquiriesResponse = {
  inquiries: Inquiry[];
  count: number;
  limit: number;
  offset: number;
};

const ContactInquiries = () => {
  const columnHelper = createDataTableColumnHelper<Inquiry>();
  const queryClient = useQueryClient();

  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading } = useQuery<InquiriesResponse>({
    queryFn: () =>
      sdk.client.fetch(`/admin/inquiries`, {
        query: {
          limit,
          offset,
        },
      }),
    queryKey: ["inquiries", limit, offset],
    refetchOnMount: "always",
  });

  const handleDelete = async (
    id: string,
    queryClient: ReturnType<typeof useQueryClient>,
  ) => {
    try {
      await sdk.client.fetch(`/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      toast.success("Inquiry deleted", {
        description: "The inquiry has been successfully removed.",
      });

      queryClient.invalidateQueries({
        queryKey: ["inquiries"],
      });
    } catch (error) {
      toast.error("Failed to delete inquiry", {
        description: "Something went wrong while deleting the inquiry.",
      });
    }
  };

  const handleHandledChange = async (id: string, handled: boolean) => {
    await sdk.client.fetch(`/admin/inquiries/${id}`, {
      method: "PATCH",
      body: {
        handled,
      },
    });

    queryClient.invalidateQueries({
      queryKey: ["inquiries"],
    });
  };

  const columns = [
    columnHelper.accessor("created_at", {
      header: "Date",
      cell: ({ getValue }) => {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(getValue()));
      },
    }),
    columnHelper.accessor("handled", {
      header: "Handled",
      cell: ({ row, getValue }) => (
        <Checkbox
          checked={getValue()}
          onCheckedChange={checked => handleHandledChange(row.original.id, !!checked)}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Clients name",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.accessor("content", {
      header: "Content",
      cell: ({ getValue }) => (
        <div className="w-[300px] text-wrap py-2">{getValue()}</div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="center">
            <DropdownMenu.Item
              className="text-ui-fg-error"
              onClick={() => handleDelete(row.original.id, queryClient)}>
              <Trash className="mr-2" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useDataTable({
    columns,
    data: data?.inquiries || [],
    getRowId: row => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Client inquiries from store contact form</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Client inquiries",
  icon: MessagePlus,
});

export default ContactInquiries;
