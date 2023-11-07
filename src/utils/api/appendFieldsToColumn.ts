type Field = string | [string, string];

export function appendFieldsToColumn(fields: Field[], columns: string[]): void {
  fields.forEach((field) => {
    let fieldName, fieldAlias;
    if (Array.isArray(field)) {
      fieldAlias = `${field[1]}`;
      fieldName = `${field[0]}`;
    } else {
      fieldAlias = `${field}`;
      fieldName = `${field}`;
    }

    columns.push(`${fieldAlias}:${fieldName}`);
  });
}
