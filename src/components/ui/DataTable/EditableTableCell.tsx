import { FormikCheckbox } from "@/components/formik/FormikCheckbox";
import { FormikCombobox } from "@/components/formik/FormikCombobox";
import { FormikDate } from "@/components/formik/FormikDate";
import { FormikDateAndTime } from "@/components/formik/FormikDateAndTime";
import { FormikDatePicker } from "@/components/formik/FormikDatePicker";
import { FormikFileInput } from "@/components/formik/FormikFileInput";
import { FormikInput } from "@/components/formik/FormikInput";
import { FormikLocalFileInput } from "@/components/formik/FormikLocalFileInput";

import { FormikSelect } from "@/components/formik/FormikSelect";
import { FormikTextArea } from "@/components/formik/FormikTextArea";
import { BasicModel } from "@/interfaces/GeneralInterfaces";
import { CellContext } from "@tanstack/react-table";
import { RefObject, useRef } from "react";

// Define a custom type for the column definition meta
type ColumnDefMeta = {
  type:
    | "Textarea"
    | "Checkbox"
    | "Input"
    | "Select"
    | "ComboBox"
    | "Decimal"
    | "DateAndTime"
    | "DatePicker"
    | "Date"
    | "FileInput"
    | "LocalFileInput"
    | "Currency";
  options: BasicModel[];
  isNumeric: boolean;
  isWholeNumber: boolean;
  label: string;
};

type EditableCellProps<TData, TValue> = {
  cell: CellContext<TData, TValue>;
  options?: BasicModel[];
};

export const EditableTableCell = <TData, TValue>({
  cell,
  options,
}: EditableCellProps<TData, TValue>) => {
  const { getValue, row, column, table } = cell;

  const dataRows = table.getFilteredRowModel().rows.length;

  // Use type assertion to access the column definition meta
  const type = (column.columnDef.meta as ColumnDefMeta).type;
  const isNumeric = (column.columnDef.meta as ColumnDefMeta).isNumeric;
  const isWholeNumber = (column.columnDef.meta as ColumnDefMeta).isWholeNumber;
  const label = (column.columnDef.meta as ColumnDefMeta).label;

  const {
    name,
    setTouchedRows,
    addRow,
    firstFieldInForm,
    lastFieldInForm,
    editable,
    forwardedRef,
    setHasUpdate,
  } = table.options.meta || {};

  const index = row.index;
  const controlName = `${name}[${index}].${column.id}`;

  // Define a common function to handle the key down event
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      if (dataRows === index + 1 && column.id === lastFieldInForm) {
        e.preventDefault();
        addRow && addRow();
      }
    }
  };

  const setArrayTouched = () => {
    setTouchedRows && setTouchedRows(index);
  };

  // Define a common prop object for the formik components
  const commonProps = {
    name: controlName,
    onKeyDown: handleKeyDown,
    setArrayTouched: setTouchedRows ? setArrayTouched : undefined,
    setHasUpdate: setHasUpdate ? setHasUpdate : undefined,
  };

  // Return the appropriate formik component based on the type
  switch (type) {
    case "Textarea":
      return (
        <FormikTextArea
          {...commonProps}
          placeholder={label}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLTextAreaElement>)
              : undefined
          }
        />
      );

    case "Checkbox":
      return (
        <FormikCheckbox
          {...commonProps}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLButtonElement>)
              : undefined
          }
        />
      );
    case "Select":
      return (
        <FormikSelect
          {...commonProps}
          options={options || []}
          showLabel={false}
          allowBlank={false}
        />
      );
    case "ComboBox":
      return (
        <FormikCombobox
          {...commonProps}
          freeSolo={false}
          items={options || []}
          label={label}
          showLabel={false}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLButtonElement>)
              : undefined
          }
        />
      );
    case "Decimal":
      return (
        <FormikInput
          placeholder={label}
          isNumeric={true}
          wholeNumberOnly={false}
          {...commonProps}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
        />
      );
    case "Currency":
      return (
        <FormikInput
          placeholder={label}
          isNumeric={true}
          wholeNumberOnly={false}
          {...commonProps}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
        />
      );
    case "DateAndTime":
      return (
        <FormikDateAndTime
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
          {...commonProps}
        />
      );
    case "Date":
      return (
        <FormikDate
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
          {...commonProps}
        />
      );
    case "DatePicker":
      return (
        <FormikDatePicker
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
          {...commonProps}
        />
      );
    case "FileInput":
      return (
        <FormikFileInput
          {...commonProps}
          index={row.index}
          parent={name}
          fieldName={column.id}
        />
      );
    case "LocalFileInput":
      return (
        <FormikLocalFileInput
          {...commonProps}
          index={row.index}
          parent={name}
          fieldName={column.id}
        />
      );
    default:
      return (
        <FormikInput
          placeholder={label}
          isNumeric={isNumeric}
          wholeNumberOnly={isWholeNumber}
          {...commonProps}
          ref={
            dataRows === index + 1 && column.id === firstFieldInForm
              ? (forwardedRef as RefObject<HTMLInputElement>)
              : undefined
          }
        />
      );
      break;
  }
};
