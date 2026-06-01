export const IDIOMAS = [
    { codigo: 'auto', nome: 'Detectar', curto: 'AUTO' },
    { codigo: 'pt-BR', nome: 'Português (BR)', curto: 'PT-BR' },
    { codigo: 'en', nome: 'Inglês', curto: 'EN' },
    { codigo: 'es', nome: 'Espanhol', curto: 'ES' },
    { codigo: 'es-LATAM', nome: 'Espanhol (LATAM)', curto: 'ES-LATAM' },
    { codigo: 'fr', nome: 'Francês', curto: 'FR' },
    { codigo: 'de', nome: 'Alemão', curto: 'DE' },
    { codigo: 'it', nome: 'Italiano', curto: 'IT' },
    { codigo: 'ja', nome: 'Japonês', curto: 'JA' },
    { codigo: 'zh', nome: 'Chinês', curto: 'ZH' },
    { codigo: 'ru', nome: 'Russo', curto: 'RU' },
    { codigo: 'ko', nome: 'Coreano', curto: 'KO' },
];
export function idiomaCurto(codigo) {
    const i = IDIOMAS.find((x) => x.codigo === codigo);
    return i ? i.curto : codigo.toUpperCase();
}
export const TONS = [
    { valor: 'formal', rotulo: 'Formal', emoji: '🤵' },
    { valor: 'casual', rotulo: 'Casual', emoji: '👋' },
    { valor: 'empatico', rotulo: 'Empático', emoji: '🤝' },
    { valor: 'assertivo', rotulo: 'Assertivo', emoji: '📣' },
    { valor: 'breve', rotulo: 'Mais breve', emoji: '✂️' },
    { valor: 'detalhado', rotulo: 'Mais detalhado', emoji: '📋' },
    { valor: 'corrigir', rotulo: 'Só corrigir', emoji: '✏️' },
];
// Tons da NYAI antiga aplicados na tela Traduzir
export const TONS_TRADUCAO = [
    { valor: 'profissional', rotulo: 'Profissional', emoji: '💼' },
    { valor: 'formal', rotulo: 'Formal', emoji: '🤵' },
    { valor: 'educado', rotulo: 'Educado', emoji: '🙂' },
    { valor: 'informal', rotulo: 'Informal', emoji: '😄' },
    { valor: 'casual', rotulo: 'Casual', emoji: '👋' },
    { valor: 'amigavel', rotulo: 'Amigável', emoji: '😊' },
];
export const PROVEDORES = [
    { valor: 'deepseek', nome: 'DeepSeek', logo: '🐳', descricao: 'bom e barato', pago: true },
    { valor: 'openai', nome: 'OpenAI', logo: '🤖', descricao: 'gpt-4o-mini', pago: true },
    { valor: 'gemini', nome: 'Gemini', logo: '✨', descricao: 'google', pago: true },
    { valor: 'claude', nome: 'Claude', logo: '🪶', descricao: 'anthropic', pago: true },
    { valor: 'ollama', nome: 'Ollama', logo: '🦙', descricao: 'local', pago: false },
];
export const URLS_CHAVES = {
    deepseek: 'https://platform.deepseek.com/api_keys',
    openai: 'https://platform.openai.com/api-keys',
    gemini: 'https://aistudio.google.com/apikey',
    claude: 'https://console.anthropic.com/settings/keys',
};
// modelos comuns por provedor. usado no dropdown da config.
// (você ainda pode digitar manual se quiser outro)
// modelos conhecidos por provedor. confira no painel do provedor antes
// de cobrar em produção — esses nomes mudam de tempos em tempos.
export const MODELOS_POR_PROVEDOR = {
    deepseek: [
        'deepseek-chat',
        'deepseek-reasoner',
    ],
    openai: [
        'gpt-4o-mini',
        'gpt-4o',
        'gpt-4.1',
        'gpt-4.1-mini',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
        'o1',
        'o1-mini',
        'o3-mini',
    ],
    gemini: [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
    ],
    claude: [
        'claude-opus-4-5',
        'claude-sonnet-4-5',
        'claude-haiku-4-5',
        'claude-opus-4-1-20250805',
        'claude-sonnet-4-20250514',
        'claude-haiku-4-5-20251001',
    ],
    ollama: [
        'mistral',
        'llama3.3',
        'llama3.2',
        'llama3.1',
        'qwen2.5',
        'qwen3',
        'phi3',
        'phi4',
        'gemma2',
    ],
};
