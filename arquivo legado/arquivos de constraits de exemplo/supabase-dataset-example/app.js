// app.js (browser demo)
import { createConstraint } from "./constraints.js";
import { createSupabaseRestClient } from "./supabaseRest.js";
import { createDatasetEngine } from "./datasetLocal.js";

const out = document.getElementById("out");
const btn = document.getElementById("btnFetch");

btn.addEventListener("click", async () => {
  try {
    out.textContent = "Buscando...";

    const SUPABASE_URL = document.getElementById("supabaseUrl").value.trim();
    const SUPABASE_ANON_KEY = document.getElementById("anonKey").value.trim();
    const planId = document.getElementById("planId").value.trim();

    const sb = createSupabaseRestClient({ supabaseUrl: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY });

    const dsEngine = createDatasetEngine({
      supabaseClient: sb,
      tipoToTableMap: { TEST_CASE: "test_cases" },
    });

    const constraints = [
      createConstraint("OPERACAO", "SELECT"),
      createConstraint("TIPO", "TEST_CASE"),
      // Here we keep the convention: constraint name matches DB column name
      createConstraint("plan_id", planId),
    ];

    const ds = await dsEngine.getDataset("dsGenerico", null, constraints, ["created_at"]);

    out.textContent = JSON.stringify(ds.values, null, 2);
  } catch (e) {
    out.textContent = String(e?.message || e);
  }
});
