import { ModelConfig } from "@/interfaces/ModelConfig";

export function getColumnOrder(
  modelConfig: ModelConfig,
  columnsToOverride?: [string, number][]
) {
  const fieldColumns: string[] = modelConfig.fields
    .filter(({ hideInTable }) => !hideInTable)
    .sort(({ fieldOrder: sortA }, { fieldOrder: sortB }) => sortA - sortB)
    .map(({ fieldName }) => fieldName);

  if (!columnsToOverride) {
    return ["select", "singleColumn", ...fieldColumns, "actions"];
  }

  const columnOrder: string[] = ["select", ...fieldColumns, "actions"];

  const overrideMap = new Map(columnsToOverride);

  return columnOrder.reduce((order, fieldName, index) => {
    const overrideIndex = overrideMap.get(fieldName);
    if (overrideIndex !== undefined) {
      order.splice(overrideIndex, 0, fieldName);
    } else {
      order.push(fieldName);
    }
    return order;
  }, [] as string[]);
}
