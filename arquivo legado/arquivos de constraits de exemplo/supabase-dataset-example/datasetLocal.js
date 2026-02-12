// datasetLocal.js
// Fluig-like getDataset/createDataset implemented locally, routed by OPERACAO + TIPO.

import { getConstraintValue, constraintsToFilterMap } from "./constraints.js";

export function createDatasetEngine({ supabaseClient, tipoToTableMap }) {
  if (!supabaseClient) throw new Error("supabaseClient is required.");
  if (!tipoToTableMap) throw new Error("tipoToTableMap is required.");

  async function getDataset(datasetName, fields, constraints, sortFields) {
    // datasetName is kept only to mirror Fluig signature.
    return createDataset(fields, constraints, sortFields);
  }

  async function createDataset(fields, constraints, sortFields) {
    const operacao = getConstraintValue(constraints, "OPERACAO");
    const tipo = getConstraintValue(constraints, "TIPO");

    if (!operacao || !tipo) {
      throw new Error("Constraints OPERACAO and TIPO are required.");
    }

    const table = tipoToTableMap[tipo];
    if (!table) {
      throw new Error(`Unknown TIPO "${tipo}". Map it in tipoToTableMap.`);
    }

    // Simple conventions:
    // - SELECT: equality filters from constraints (excluding OPERACAO/TIPO)
    // - INSERT: use constraint PAYLOAD_JSON as JSON string (one row)
    // - UPDATE: use constraint ID (or other filters) + PAYLOAD_JSON as patch
    // - DELETE: use constraint ID (or other filters)
    const op = operacao.toUpperCase();

    if (op === "SELECT") {
      const filters = constraintsToFilterMap(constraints);
      const orderBy = Array.isArray(sortFields) && sortFields.length ? sortFields[0] : undefined;
      const data = await supabaseClient.select(table, { filters, orderBy });
      return { values: data };
    }

    if (op === "INSERT") {
      const payloadJson = getConstraintValue(constraints, "PAYLOAD_JSON");
      if (!payloadJson) throw new Error("INSERT requires PAYLOAD_JSON constraint.");
      const row = JSON.parse(payloadJson);
      const data = await supabaseClient.insert(table, row);
      return { values: data };
    }

    if (op === "UPDATE") {
      const payloadJson = getConstraintValue(constraints, "PAYLOAD_JSON");
      if (!payloadJson) throw new Error("UPDATE requires PAYLOAD_JSON constraint.");
      const patch = JSON.parse(payloadJson);

      // Prefer ID filter if provided; otherwise use remaining constraints as filters.
      const id = getConstraintValue(constraints, "ID");
      const filters = id ? { id } : constraintsToFilterMap(constraints, ["OPERACAO", "TIPO", "PAYLOAD_JSON"]);
      if (!Object.keys(filters).length) throw new Error("UPDATE requires ID or at least one filter constraint.");

      const data = await supabaseClient.update(table, { filters, patch });
      return { values: data };
    }

    if (op === "DELETE") {
      const id = getConstraintValue(constraints, "ID");
      const filters = id ? { id } : constraintsToFilterMap(constraints);
      if (!Object.keys(filters).length) throw new Error("DELETE requires ID or at least one filter constraint.");

      const data = await supabaseClient.remove(table, { filters });
      return { values: data };
    }

    throw new Error(`Unsupported OPERACAO: ${operacao}`);
  }

  return { getDataset };
}
