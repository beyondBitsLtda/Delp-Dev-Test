
/* ===================================================================
 * Helpers gerais
 * =================================================================== */
function isNulo(v) {
  return v === null || v === undefined || String(v).trim() === "";
}

function isExcelError(val) {
  return /^#VALOR!?$/i.test((val ?? "").toString().trim());
}


/* funções para abrir e fechar os modais de ajuda */
        function abrirModalAjuda() {
            document.getElementById('modal-ajuda').style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Previne scroll da página
        }

        function fecharModalAjuda() {
            document.getElementById('modal-ajuda').style.display = 'none';
            document.body.style.overflow = ''; // Restaura scroll
        }

        // Fecha modal ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharModalAjuda();
            }
        });

   function abrirProjeto(e){
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      var projeto = ($("#PROJETO_TESTE").val() || $("#PROJETO").val() || "").trim();
      var operacao = ($("#OPERACAO").val() || $("#IMPORTACAO").val() || "").trim();

      if (isNulo(projeto)) {
        alert("Selecione um projeto para iniciar os casos de teste.");
        return false;
      }

      $("#selection-menu").hide();
      $("#page-action").show();
      $("#cards").show();
      $("#btn-help").show();

      console.log("[UI] abrirProjeto()", { projeto, operacao });
      return false;
    }
