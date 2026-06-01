// Preload: única ponte entre React e o sistema. O React só enxerga o que
// estiver listado aqui dentro (em window.nyai.*). Nada além disso passa.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nyai', {
  janelaMinimizar:          () => ipcRenderer.invoke('nyai:janela-minimizar'),
  janelaOcultar:            () => ipcRenderer.invoke('nyai:janela-ocultar'),
  janelaMaximizarRestaurar: () => ipcRenderer.invoke('nyai:janela-maximizar-restaurar'),
  abrirExterno:             (url) => ipcRenderer.invoke('nyai:abrir-externo', url),
  copiarTexto:              (texto) => ipcRenderer.invoke('nyai:copiar-texto', texto),

  obterConfiguracao:  () => ipcRenderer.invoke('nyai:obter-configuracao'),
  salvarConfiguracao: (parcial) => ipcRenderer.invoke('nyai:salvar-configuracao', parcial),

  obterMemoria:     () => ipcRenderer.invoke('nyai:obter-memoria'),
  adicionarExemplo: (exemplo) => ipcRenderer.invoke('nyai:adicionar-exemplo', exemplo),
  removerExemplo:   (indice) => ipcRenderer.invoke('nyai:remover-exemplo', indice),
  limparMemoria:    () => ipcRenderer.invoke('nyai:limpar-memoria'),

  obterFrases:    () => ipcRenderer.invoke('nyai:obter-frases'),
  adicionarFrase: (frase) => ipcRenderer.invoke('nyai:adicionar-frase', frase),
  removerFrase:   (indice) => ipcRenderer.invoke('nyai:remover-frase', indice),
  limparFrases:   () => ipcRenderer.invoke('nyai:limpar-frases'),
  buscarFrase:    (params) => ipcRenderer.invoke('nyai:buscar-frase', params),

  requisicaoIA: (params) => ipcRenderer.invoke('nyai:requisicao-ia', params),

  obterTokens: () => ipcRenderer.invoke('nyai:obter-tokens'),
  zerarTokens: () => ipcRenderer.invoke('nyai:zerar-tokens'),

  verificarOllama:      () => ipcRenderer.invoke('nyai:verificar-ollama'),
  listarModelosOllama:  () => ipcRenderer.invoke('nyai:listar-modelos-ollama'),

  ouvir: (canal, callback) => {
    const canaisPermitidos = [
      'nyai:atalho-capturar-traduzir',
      'nyai:atalho-capturar-reescrever',
      'nyai:atalho-salvar-resposta',
      'nyai:traducao-rapida-pronta',
      'nyai:tokens-atualizados',
      'nyai:status-ollama',
      'nyai:abrir-busca-rapida',
    ];
    if (!canaisPermitidos.includes(canal)) return () => {};
    const handler = (_e, dados) => callback(dados);
    ipcRenderer.on(canal, handler);
    return () => ipcRenderer.removeListener(canal, handler);
  },
});
