"use client";
import { Row, Table as TTable, flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { DraggableRow } from "@/components/ui/DataTable/DraggableRow";

export interface DialogFormProps<T> {
  openDialogHandler: (row?: Row<T>["original"]) => void;
}

interface DataTableProps<T> {
  modelConfig: ModelConfig;
  table: TTable<T>;
  isLoading: boolean;
  draggableField?: ModelConfig["fields"][number];
  reorderRow?: (draggedRowIndex: number, targetRowIndex: number) => void;
  isFetching?: boolean;
  dialogFormProps?: DialogFormProps<T>;
  onRowClick?: (row: Row<T>["original"]) => void;
}

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    modelConfig,
    table,
    isLoading,
    draggableField,
    reorderRow,
    isFetching,
    dialogFormProps,
    onRowClick,
  } = props;
  const rowData = table.getRowModel().rows;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {draggableField && <TableHead className="w-[50px]"></TableHead>}
            {headerGroup.headers.map((header) => {
              //@ts-ignore
              const customWidth = header.column.columnDef.meta?.width;
              return (
                <TableHead
                  key={header.id}
                  className={cn({
                    "w-[50px]": ["select", "actions"].includes(header.id),
                  })}
                  style={{
                    width: `${customWidth}px`,
                  }}
                  align={
                    (header.column.columnDef.meta as any)?.alignment || "left"
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading || isFetching ? (
          <TableRow>
            <TableCell
              colSpan={table.getVisibleFlatColumns().length}
              className="h-24 text-center"
            >
              Loading.
            </TableCell>
          </TableRow>
        ) : rowData.length > 0 ? (
          <>
            {rowData.map((row) => {
              return draggableField && reorderRow ? (
                <DraggableRow
                  key={row.id}
                  row={row}
                  reorderRow={reorderRow}
                />
              ) : (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSelectable = ["select", "actions"].includes(
                      cell.column.id
                    );
                    const cellClickHandler = isSelectable
                      ? undefined
                      : dialogFormProps?.openDialogHandler || onRowClick;
                    const isCursorDefault = isSelectable || !cellClickHandler;

                    return (
                      <TableCell
                        key={cell.id}
                        align={(cell.column.columnDef.meta as any)?.alignment}
                        className={cn("cursor-pointer", {
                          "cursor-default": isCursorDefault,
                        })}
                        onClick={() => cellClickHandler?.(cell.row.original)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </>
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getVisibleFlatColumns().length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {modelConfig.fields.some((field) => field.summarizedBy) && (
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {draggableField && <TableHead className="w-[50px]"></TableHead>}
              {footerGroup.headers.map((header) => {
                //@ts-ignore
                const customWidth = header.column.columnDef.meta?.width;
                return (
                  <TableHead
                    key={header.id}
                    className={cn({
                      "w-[50px]": ["select", "actions"].includes(header.id),
                    })}
                    style={{
                      width: `${customWidth}px`,
                    }}
                    align={
                      (header.column.columnDef.meta as any)?.alignment || "left"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableFooter>
      )}
    </Table>
  );
}
