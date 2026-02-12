// exampleSelect.js
// Example: SELECT test_cases using Fluig-like constraints, but hitting Supabase REST.

import { createConstraint } from "./constraints.js";
import { createSupabaseRestClient } from "./supabaseRest.js";
import { createDatasetEngine } from "./datasetLocal.js";

// 1) Configure your Supabase project values here
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// 2) Create REST client
const sb = createSupabaseRestClient({
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
});

// 3) Map TIPO -> table
const tipoToTableMap = {
  TEST_CASE: "test_cases",
  PLAN: "test_plans",
  TICKET: "tickets",
};

// 4) Create local dataset engine
const dsEngine = createDatasetEngine({ supabaseClient: sb, tipoToTableMap });

// 5) Example SELECT: all cases for a plan (and optional filters)
async function run() {
  const planId = "a1b76b09-6430-4a1e-9cb6-2449895856da"; // replace with yours

  const constraints = [
    createConstraint("OPERACAO", "SELECT"),
    createConstraint("TIPO", "TEST_CASE"),
    createConstraint("plan_id", planId), // IMPORTANT: constraint name matches DB column (plan_id)
    // createConstraint("resultado", "APROVADO"), // optional filter
  ];

  const ds = await dsEngine.getDataset("dsGenerico", null, constraints, ["created_at"]);
  console.table(ds.values);
}

run().catch(console.error);
