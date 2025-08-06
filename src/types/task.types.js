/**
 * Definições de tipos e constantes para o TaskFlow
 * Centraliza todas as definições para melhor manutenção
 */

// ========== CONSTANTES ==========

// Status possíveis das tarefas
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress', 
  DONE: 'done'
};

// Prioridades das tarefas
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Modos de visualização
export const VIEW_MODES = {
  KANBAN: 'kanban',
  LIST: 'list'
};

// Temas da aplicação
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Colunas do Kanban Board
export const KANBAN_COLUMNS = [
  {
    id: TASK_STATUS.TODO,
    title: 'A Fazer',
    color: 'bg-blue-500',
    description: 'Tarefas que ainda não foram iniciadas'
  },
  {
    id: TASK_STATUS.IN_PROGRESS,
    title: 'Em Progresso', 
    color: 'bg-yellow-500',
    description: 'Tarefas que estão sendo executadas'
  },
  {
    id: TASK_STATUS.DONE,
    title: 'Concluído',
    color: 'bg-green-500', 
    description: 'Tarefas finalizadas'
  }
];

// Cores das prioridades
export const PRIORITY_COLORS = {
  [TASK_PRIORITY.HIGH]: 'bg-red-500',
  [TASK_PRIORITY.MEDIUM]: 'bg-yellow-500',
  [TASK_PRIORITY.LOW]: 'bg-green-500'
};

// Labels das prioridades
export const PRIORITY_LABELS = {
  [TASK_PRIORITY.HIGH]: 'Alta',
  [TASK_PRIORITY.MEDIUM]: 'Média', 
  [TASK_PRIORITY.LOW]: 'Baixa'
};

// Labels dos status
export const STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'A Fazer',
  [TASK_STATUS.IN_PROGRESS]: 'Em Progresso',
  [TASK_STATUS.DONE]: 'Concluído'
};

// Configurações padrão
export const DEFAULT_TASK = {
  title: '',
  description: '',
  priority: TASK_PRIORITY.MEDIUM,
  category: '',
  status: TASK_STATUS.TODO,
  dueDate: null,
  createdAt: new Date()
};

// Limite de caracteres
export const LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_MAX_LENGTH: 50
};

// ========== DEFINIÇÕES DE TIPOS (para documentação) ==========

/**
 * @typedef {Object} Task
 * @property {string} id - Identificador único da tarefa
 * @property {string} title - Título da tarefa (obrigatório)
 * @property {string} description - Descrição detalhada da tarefa
 * @property {('low'|'medium'|'high')} priority - Prioridade da tarefa
 * @property {string} category - Categoria da tarefa
 * @property {('todo'|'in-progress'|'done')} status - Status atual da tarefa
 * @property {Date} createdAt - Data de criação da tarefa
 * @property {Date|null} dueDate - Data de vencimento (opcional)
 */

/**
 * @typedef {Object} TaskStats
 * @property {number} total - Total de tarefas
 * @property {number} todo - Tarefas a fazer
 * @property {number} inProgress - Tarefas em progresso
 * @property {number} done - Tarefas concluídas
 * @property {number} overdue - Tarefas atrasadas
 */

/**
 * @typedef {Object} TaskFilters
 * @property {string} searchTerm - Termo de busca
 * @property {string} priority - Filtro de prioridade ('all' | 'low' | 'medium' | 'high')
 * @property {string} category - Filtro de categoria ('all' | categoria específica)
 */

/**
 * @typedef {Object} AppState
 * @property {Task[]} tasks - Lista de tarefas
 * @property {boolean} isModalOpen - Modal de criação/edição aberto
 * @property {Task|null} editingTask - Tarefa sendo editada
 * @property {string} searchTerm - Termo de busca atual
 * @property {string} filterPriority - Filtro de prioridade atual
 * @property {string} filterCategory - Filtro de categoria atual
 * @property {boolean} isDarkMode - Modo escuro ativo
 * @property {('kanban'|'list')} viewMode - Modo de visualização atual
 * @property {Task|null} draggedTask - Tarefa sendo arrastada
 */

// ========== VALIDAÇÕES ==========

// Regex para validações
export const VALIDATION_REGEX = {
  // Aceita letras, números, espaços e caracteres especiais comuns
  TITLE: /^[a-zA-ZÀ-ÿ0-9\s\-_.,!?()]+$/,
  // Categoria pode conter apenas letras, números e espaços
  CATEGORY: /^[a-zA-ZÀ-ÿ0-9\s]+$/
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Título é obrigatório',
  TITLE_TOO_LONG: `Título deve ter no máximo ${LIMITS.TITLE_MAX_LENGTH} caracteres`,
  TITLE_INVALID: 'Título contém caracteres inválidos',
  DESCRIPTION_TOO_LONG: `Descrição deve ter no máximo ${LIMITS.DESCRIPTION_MAX_LENGTH} caracteres`,
  CATEGORY_TOO_LONG: `Categoria deve ter no máximo ${LIMITS.CATEGORY_MAX_LENGTH} caracteres`,
  CATEGORY_INVALID: 'Categoria contém caracteres inválidos',
  PRIORITY_INVALID: 'Prioridade inválida',
  STATUS_INVALID: 'Status inválido',
  DATE_INVALID: 'Data inválida'
};

// ========== CONFIGURAÇÕES DE LOCAL STORAGE ==========

export const STORAGE_KEYS = {
  TASKS: 'taskflow-tasks',
  THEME: 'taskflow-theme',
  VIEW_MODE: 'taskflow-view-mode',
  FILTERS: 'taskflow-filters'
};