
// Função de adicionar projetos
   function adicionarProjeto(){

    // Essa função vai adicionar um projeto no banco de dados (DELP_PROJETOTESTE) - A fazer
    // Vai trazer modal de adiconar projeto com o formulário com os campos necessários.
    // vai esconder os elementos que não são necessários.

    $("#modal-Projeto").addClass("is-open");
    console.log("voletei");

   }

   // Função de fechar modal de cadastro projetos
   function fecharModalProjeto(){

    $("#modal-Projeto").removeClass("is-open");
    console.log("voletei");

   }

   // Fecha modal ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharModalProjeto();
            }
        });
    
    
