import { Badge } from "@/components/ui/Badge";
import { DataTableColumnHeader } from "@/components/ui/DataTable/DataTableColumnHeader";
import { EditableTableCell } from "@/components/ui/DataTable/EditableTableCell";
import { BasicModel, UnknownObject } from "@/interfaces/GeneralInterfaces";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { findModelUniqueFieldName } from "@/lib/findModelUniqueFieldName";
import { formatDecimal } from "@/lib/formatDecimal";
import { getColumnAlignment } from "@/utils/utilities";
import {
  CellContext,
  ColumnDef,
  ColumnHelper,
  HeaderContext,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Decimal from "decimal.js";
import { Check, X } from "lucide-react";

export interface ColumnsToBeOverriden<TData, TValue> {
  [key: string]: {
    header?: (header: HeaderContext<TData, TValue>) => JSX.Element;
    cell?: (cell: CellContext<TData, TValue>) => JSX.Element;
  };
}

export const createTableColumns = <T,>(
  config: ModelConfig,
  modelColumnHelper: ColumnHelper<T>,
  columnsToBeOverriden?: ColumnsToBeOverriden<T, unknown>
): ColumnDef<T, unknown>[] => {
  return config.fields
    .sort(({ fieldOrder: sortA }, { fieldOrder: sortB }) => sortA - sortB)
    .map(
      ({
        fieldName,
        verboseFieldName,
        controlType,
        seqModelFieldID,
        relatedModelID,
        dataType,
        dataTypeInterface,
        summarizedBy,
      }) => {
        const relatedModel = AppConfig.models.find(
          (model) => model.seqModelID === relatedModelID
        );

        //@ts-ignore
        return modelColumnHelper.accessor(fieldName, {
          header: (header) => {
            //Eearly exit if this will be overriden
            const headerFunction = columnsToBeOverriden?.[fieldName]?.header;
            if (headerFunction) {
              return headerFunction(header);
            }
            return (
              <DataTableColumnHeader
                column={header.column}
                title={verboseFieldName}
              />
            );
          },
          cell: (cell) => {
            //Eearly exit if this will be overriden
            const cellFunction = columnsToBeOverriden?.[fieldName]?.cell;
            if (cellFunction) {
              return cellFunction(cell);
            }

            if (cell.table.options.meta?.editable) {
              let options: BasicModel[] | undefined = [];

              if (relatedModel) {
                const opt = cell.table.options.meta?.options;

                options = opt ? opt[relatedModel.variableName + "List"] : [];
              } else {
                options = [];
              }

              return (
                <EditableTableCell
                  cell={cell}
                  options={options}
                />
              );
            }

            if (relatedModel) {
              const uniqueFieldName = findModelUniqueFieldName(relatedModel);
              //@ts-ignore
              return cell.row.original[relatedModel.modelName][uniqueFieldName];
            }

            const cellValue = cell.getValue();

            if (dataType === "BOOLEAN") {
              return cellValue ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <X className="w-4 h-4 text-destructive" />
              );
            }

            if (cellValue) {
              if (dataType === "DATEONLY") {
                return format(
                  new Date(cell.getValue() as string),
                  "MM/dd/yyyy, EEE"
                );
              }

              if (dataType === "DATE") {
                return format(
                  new Date(cell.getValue() as string),
                  "M/d/yyyy hh:mm a"
                );
              }
            }

            return cellValue;
          },
          footer: (footer) => {
            if (summarizedBy) {
              const sum = footer.table
                .getFilteredRowModel()
                .rows.reduce(
                  (acc, row) =>
                    new Decimal(acc).plus(
                      row.original[
                        fieldName as keyof typeof row.original
                      ] as Decimal.Value
                    ),
                  new Decimal(0)
                );
              return (
                <div className="text-right">SUM: {formatDecimal(sum)}</div>
              );
            }

            return null;
          },
          meta: {
            type: controlType,
            label: verboseFieldName,
            alignment: getColumnAlignment(
              dataType,
              relatedModelID,
              dataTypeInterface
            ),
          },
          enableSorting: config.sorts.some(
            (sort) => sort.seqModelFieldID === seqModelFieldID
          ),
        });
      }
    );
};
