!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION "Deseja apagar tambem suas configuracoes da NYAI? Isso inclui chaves de API, memoria de estilo e frases salvas. Sim para limpeza total. Nao para manter caso reinstale depois." IDNO PreservarConfig

  RMDir /r "$APPDATA\nyai"
  RMDir /r "$LOCALAPPDATA\nyai"
  Goto FimUninstall

  PreservarConfig:

  FimUninstall:
!macroend
