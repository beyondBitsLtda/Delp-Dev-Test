/* global bootstrap, $ */
(function () {
  'use strict';

  var STORAGE_KEY = 'qa_test_plan_state_v1';
  var state = {
    testCases: []
  };

  var currentEditingId = null;
  var currentEditingCase = null;
  var filterOnlyFailed = false;

  var TestCaseRepository = {
    list: function () {
      // Futuramente substituir por DatasetFactory.getDataset() + constraints
      return loadState().testCases;
    },
    create: function (data) {
      // Futuramente substituir por DatasetFactory.getDataset() + constraints
      state.testCases.push(data);
      saveState();
    },
    update: function (id, data) {
      // Futuramente substituir por DatasetFactory.getDataset() + constraints
      var index = state.testCases.findIndex(function (item) {
        return item.id === id;
      });
      if (index !== -1) {
        state.testCases[index] = data;
        saveState();
      }
    },
    remove: function (id) {
      // Futuramente substituir por DatasetFactory.getDataset() + constraints
      state.testCases = state.testCases.filter(function (item) {
        return item.id !== id;
      });
      saveState();
    }
  };

  function generateId() {
    return 'tc_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function loadState() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        state = JSON.parse(raw);
      } catch (error) {
        state = { testCases: [] };
      }
    }
    if (!state.testCases) {
      state.testCases = [];
    }
    return state;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetForm() {
    $('#caseForm')[0].reset();
    $('#caseId').val('');
    currentEditingId = null;
    currentEditingCase = {
      evidences: []
    };
    renderEvidenceList();
  }

  function openCaseModal(testCase) {
    resetForm();
    if (testCase) {
      currentEditingId = testCase.id;
      currentEditingCase = JSON.parse(JSON.stringify(testCase));
      $('#caseId').val(testCase.id);
      $('#caseTitle').val(testCase.title);
      $('#caseDescription').val(testCase.description);
      $('#caseType').val(testCase.type);
      $('#caseStatus').val(testCase.status);
      $('#casePriority').val(testCase.priority);
      $('#caseResponsible').val(testCase.responsible);
      $('#caseNotes').val(testCase.notes);
      renderEvidenceList();
    }
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('caseModal'));
    modal.show();
  }

  function renderSummary() {
    var total = state.testCases.length;
    var approved = state.testCases.filter(function (item) {
      return item.status === 'aprovado';
    }).length;
    var failed = state.testCases.filter(function (item) {
      return item.status === 'reprovado';
    }).length;
    $('#summaryTotal').text(total);
    $('#summaryApproved').text(approved);
    $('#summaryFailed').text(failed);
  }

  function renderEvidenceList() {
    var container = $('#evidenceList');
    container.empty();
    if (!currentEditingCase || !currentEditingCase.evidences || currentEditingCase.evidences.length === 0) {
      container.append('<p class="text-muted mb-0">Nenhuma evidência adicionada.</p>');
      return;
    }
    currentEditingCase.evidences.forEach(function (evidence) {
      var preview = evidence.type === 'image'
        ? '<img src="' + evidence.dataUrl + '" alt="Evidência" class="evidence-thumb">'
        : '<div class="bg-dark text-white p-3 rounded">Vídeo</div>';
      var item = [
        '<div class="d-flex flex-column flex-md-row align-items-md-center gap-3 border rounded p-3 mb-2">',
        '<div>' + preview + '</div>',
        '<div class="flex-grow-1">',
        '<div><strong>' + evidence.description + '</strong></div>',
        '<div class="text-muted small">Tipo: ' + evidence.type + ' | Data: ' + new Date(evidence.createdAt).toLocaleString() + '</div>',
        '</div>',
        '<div class="d-flex gap-2">',
        '<button type="button" class="btn btn-outline-primary btn-sm js-view-evidence" data-id="' + evidence.id + '">Ver</button>',
        '<button type="button" class="btn btn-outline-danger btn-sm js-remove-evidence" data-id="' + evidence.id + '">Remover</button>',
        '</div>',
        '</div>'
      ].join('');
      container.append(item);
    });
  }

  function renderList() {
    var container = $('#caseList');
    container.empty();
    var items = state.testCases.slice();
    if (filterOnlyFailed) {
      items = items.filter(function (item) {
        return item.status === 'reprovado';
      });
    }
    if (items.length === 0) {
      container.append('<p class="text-muted">Nenhum caso de teste encontrado.</p>');
      return;
    }
    items.forEach(function (item) {
      var card = [
        '<div class="card case-card status-' + item.status + ' mb-3">',
        '<div class="card-body">',
        '<div class="d-flex flex-column flex-lg-row justify-content-between gap-3">',
        '<div>',
        '<h5 class="card-title mb-1">' + item.title + '</h5>',
        '<p class="mb-1 text-muted">' + item.description + '</p>',
        '<div class="small text-muted">Tipo: ' + item.type + ' | Prioridade: ' + item.priority + ' | Responsável: ' + item.responsible + '</div>',
        '<div class="small text-muted">Criado: ' + new Date(item.createdAt).toLocaleString() + ' | Atualizado: ' + new Date(item.updatedAt).toLocaleString() + '</div>',
        '</div>',
        '<div class="text-lg-end">',
        '<span class="badge bg-secondary badge-status">' + item.status + '</span>',
        '<div class="mt-3 d-flex flex-row flex-lg-column gap-2">',
        '<button type="button" class="btn btn-outline-primary btn-sm js-edit" data-id="' + item.id + '">Editar</button>',
        '<button type="button" class="btn btn-outline-danger btn-sm js-delete" data-id="' + item.id + '">Remover</button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
      ].join('');
      container.append(card);
    });
  }

  function openEvidenceModal(evidence) {
    var container = $('#evidenceModalBody');
    container.empty();
    if (evidence.type === 'image') {
      container.append('<img src="' + evidence.dataUrl + '" alt="Evidência" class="img-fluid rounded">');
    } else {
      container.append('<video src="' + evidence.dataUrl + '" class="w-100" controls></video>');
    }
    $('#evidenceModalTitle').text(evidence.description || 'Evidência');
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('evidenceModal'));
    modal.show();
  }

  function buildReport() {
    var lines = [];
    lines.push('RELATÓRIO - CONTROLE DE PLANO DE TESTES');
    lines.push('Gerado em: ' + new Date().toLocaleString());
    lines.push('');
    lines.push('Resumo:');
    lines.push('- Total: ' + state.testCases.length);
    lines.push('- Aprovados: ' + state.testCases.filter(function (item) { return item.status === 'aprovado'; }).length);
    lines.push('- Reprovados: ' + state.testCases.filter(function (item) { return item.status === 'reprovado'; }).length);
    lines.push('- Pendentes: ' + state.testCases.filter(function (item) { return item.status === 'pendente'; }).length);
    lines.push('');
    lines.push('Casos de Teste:');
    state.testCases.forEach(function (item, index) {
      lines.push('');
      lines.push((index + 1) + '. ' + item.title + ' [' + item.status + ']');
      lines.push('   Tipo: ' + item.type + ' | Prioridade: ' + item.priority + ' | Responsável: ' + item.responsible);
      lines.push('   Descrição: ' + item.description);
      lines.push('   Observações: ' + item.notes);
      lines.push('   Evidências: ' + (item.evidences ? item.evidences.length : 0));
    });
    return lines.join('\n');
  }

  function exportStateToJsonFile() {
    var data = JSON.stringify(state, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'qa_test_plan_state.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function importStateFromJsonFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (event) {
        try {
          var parsed = JSON.parse(event.target.result);
          if (!parsed.testCases) {
            throw new Error('Formato inválido.');
          }
          state = parsed;
          saveState();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = function () {
        reject(new Error('Falha ao ler arquivo.'));
      };
      reader.readAsText(file);
    });
  }

  function handleEvidenceAdd() {
    var type = $('#evidenceType').val();
    var description = $('#evidenceDescription').val();
    var file = $('#evidenceFile')[0].files[0];
    if (!file) {
      alert('Selecione um arquivo de evidência.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      var evidence = {
        id: 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: type,
        dataUrl: event.target.result,
        description: description || 'Evidência sem descrição',
        createdAt: nowIso()
      };
      currentEditingCase.evidences.push(evidence);
      $('#evidenceDescription').val('');
      $('#evidenceFile').val('');
      renderEvidenceList();
    };
    reader.readAsDataURL(file);
  }

  function bindEvents() {
    $('#btnNewCase').on('click', function () {
      openCaseModal(null);
    });

    $('#caseForm').on('submit', function (event) {
      event.preventDefault();
      var now = nowIso();
      var data = {
        id: currentEditingId || generateId(),
        title: $('#caseTitle').val(),
        description: $('#caseDescription').val(),
        type: $('#caseType').val(),
        status: $('#caseStatus').val(),
        priority: $('#casePriority').val(),
        responsible: $('#caseResponsible').val(),
        createdAt: currentEditingCase.createdAt || now,
        updatedAt: now,
        notes: $('#caseNotes').val(),
        evidences: currentEditingCase.evidences || []
      };

      if (currentEditingId) {
        TestCaseRepository.update(currentEditingId, data);
      } else {
        TestCaseRepository.create(data);
      }

      renderSummary();
      renderList();

      var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('caseModal'));
      modal.hide();
    });

    $('#caseList').on('click', '.js-edit', function () {
      var id = $(this).data('id');
      var testCase = state.testCases.find(function (item) {
        return item.id === id;
      });
      openCaseModal(testCase);
    });

    $('#caseList').on('click', '.js-delete', function () {
      var id = $(this).data('id');
      if (confirm('Deseja remover este caso de teste?')) {
        TestCaseRepository.remove(id);
        renderSummary();
        renderList();
      }
    });

    $('#btnExportJson').on('click', function () {
      exportStateToJsonFile();
    });

    $('#btnOpenImport').on('click', function () {
      $('#importFile').val('');
      $('#importText').val('');
      var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('importModal'));
      modal.show();
    });

    $('#btnImportJson').on('click', function () {
      var file = $('#importFile')[0].files[0];
      var text = $('#importText').val();
      if (file) {
        importStateFromJsonFile(file)
          .then(function () {
            renderSummary();
            renderList();
            bootstrap.Modal.getOrCreateInstance(document.getElementById('importModal')).hide();
          })
          .catch(function (error) {
            alert(error.message);
          });
        return;
      }
      if (text) {
        try {
          var parsed = JSON.parse(text);
          if (!parsed.testCases) {
            throw new Error('Formato inválido.');
          }
          state = parsed;
          saveState();
          renderSummary();
          renderList();
          bootstrap.Modal.getOrCreateInstance(document.getElementById('importModal')).hide();
        } catch (error) {
          alert(error.message);
        }
      } else {
        alert('Envie um arquivo ou cole um JSON.');
      }
    });

    $('#filterFailed').on('change', function () {
      filterOnlyFailed = $(this).is(':checked');
      renderList();
    });

    $('#btnOpenReport').on('click', function () {
      var report = buildReport();
      $('#reportOutput').val(report);
      var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('reportModal'));
      modal.show();
    });

    $('#btnAddEvidence').on('click', function () {
      handleEvidenceAdd();
    });

    $('#evidenceList').on('click', '.js-remove-evidence', function () {
      var id = $(this).data('id');
      currentEditingCase.evidences = currentEditingCase.evidences.filter(function (item) {
        return item.id !== id;
      });
      renderEvidenceList();
    });

    $('#evidenceList').on('click', '.js-view-evidence', function () {
      var id = $(this).data('id');
      var evidence = currentEditingCase.evidences.find(function (item) {
        return item.id === id;
      });
      if (evidence) {
        openEvidenceModal(evidence);
      }
    });
  }

  function init() {
    loadState();
    renderSummary();
    renderList();
    bindEvents();
  }

  $(document).ready(init);
})();
