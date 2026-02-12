// constraints.js
// "Fluig-like" constraint object + helpers.

export const ConstraintType = {
  MUST: "MUST",
  SHOULD: "SHOULD",
  MUST_NOT: "MUST_NOT",
};

export function createConstraint(fieldName, initialValue, finalValue = initialValue, type = ConstraintType.MUST) {
  return { fieldName, initialValue, finalValue, type };
}

export function getConstraintValue(constraints, fieldName) {
  return constraints.find(c => c.fieldName === fieldName)?.initialValue ?? null;
}

export function constraintsToFilterMap(constraints, ignored = ["OPERACAO", "TIPO"]) {
  // Converts constraints into { columnName: value } for simple equality filters.
  // Convention: constraint FIELD_NAME uses DB COLUMN NAME (case-insensitive).
  const filters = {};
  for (const c of constraints) {
    if (ignored.includes(c.fieldName)) continue;
    if (c.initialValue === undefined || c.initialValue === null || c.initialValue === "") continue;
    filters[c.fieldName.toLowerCase()] = c.initialValue;
  }
  return filters;
}
