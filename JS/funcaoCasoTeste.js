/* funções para abrir e fechar os modaais de adicioar casos de teste */
        function abrirModalCasoTeste() {
            document.getElementById('modal-caso-teste').style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Previne scroll da página
        }

        function fecharModalCasoTeste() {
            document.getElementById('modal-caso-teste').style.display = 'none';
            document.body.style.overflow = ''; // Restaura scroll
        }

        // Fecha modal ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharModalCasoTeste();
            }
        });