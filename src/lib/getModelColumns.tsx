import { ModelRowActions } from "@/components/ModelRowActions";
import { Checkbox } from "@/components/ui/Checkbox";
import { DeleteRowColumn } from "@/components/ui/DataTable/DeleteRowColumn";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { ColumnsToBeOverriden, createTableColumns } from "@/lib/table-utils";
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";

interface ModelColumnProps<TData, TValue> {
  modelConfig: ModelConfig;
  ModelSingleColumn?:
    | React.FC<{ cell: CellContext<TData, TValue> }>
    | undefined; // replace CellType with the actual type of cell
  columnsToBeOverriden?: ColumnsToBeOverriden<TData, unknown>;
}

export const getModelColumns = <TData, TValue>({
  ModelSingleColumn,
  modelConfig,
  columnsToBeOverriden,
}: ModelColumnProps<TData, TValue>): ColumnDef<TData, TValue>[] => {
  const columnHelper = createColumnHelper<TData>();

  const columns: ColumnDef<TData, TValue>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const toggleSelectAllRow = table.options.meta?.toggleSelectAllRow;
        return (
          <div className="flex justify-center w-full">
            <Checkbox
              tabIndex={-1}
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={() => {
                toggleSelectAllRow && toggleSelectAllRow();
              }}
              aria-label="Select all"
            />
          </div>
        );
      },
      cell: ({ row, table }) => {
        const toggleRow = table.options.meta?.toggleRow;
        return (
          <div className="flex justify-center">
            <Checkbox
              tabIndex={-1}
              checked={row.getIsSelected()}
              onCheckedChange={() => {
                toggleRow && toggleRow(row.index);
              }}
              aria-label="Select row"
            />
          </div>
        );
      },
    },
  ];

  if (ModelSingleColumn) {
    columns.push({
      id: "singleColumn",
      header: () => (
        <div className="flex justify-center w-full">
          {modelConfig.pluralizedVerboseModelName}
        </div>
      ),
      cell: (cell) => <ModelSingleColumn cell={cell} />,
    });
  }

  return [
    ...columns,
    ...createTableColumns<TData>(
      modelConfig,
      columnHelper,
      columnsToBeOverriden
    ),
    {
      id: "actions",
      cell: (cell) =>
        modelConfig.isRowAction ? (
          <ModelRowActions
            cell={cell}
            modelConfig={modelConfig}
          />
        ) : (
          <DeleteRowColumn {...cell} />
        ),
    },
  ] as ColumnDef<TData, TValue>[];
};
