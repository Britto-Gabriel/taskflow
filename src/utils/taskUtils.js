/**
 * Utilitários para manipulação de tarefas
 * Funções puras para lógica de negócio
 */

// Gerar ID único para novas tarefas
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Obter cor da prioridade baseada no sistema de design
export const getPriorityColor = (priority) => {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500', 
    low: 'bg-green-500',
    default: 'bg-gray-500'
  };
  
  return priorityColors[priority] || priorityColors.default;
};

// Verificar se uma tarefa está atrasada
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  
  const today = new Date();
  const due = new Date(dueDate);
  
  // Remove horas para comparar apenas datas
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};

// Calcular estatísticas das tarefas
export const calculateStats = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) {
    return {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0
    };
  }

  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0, 
    done: 0,
    overdue: 0
  };

  tasks.forEach(task => {
    // Contar por status
    switch(task.status) {
      case 'todo':
        stats.todo++;
        break;
      case 'in-progress':
        stats.inProgress++;
        break;
      case 'done':
        stats.done++;
        break;
    }

    // Contar tarefas atrasadas (apenas não concluídas)
    if (isOverdue(task.dueDate) && task.status !== 'done') {
      stats.overdue++;
    }
  });

  return stats;
};

// Filtrar tarefas baseado em critérios
export const filterTasks = (tasks, filters) => {
  const { searchTerm, priority, category } = filters;
  
  return tasks.filter(task => {
    // Filtro de busca (título e descrição)
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de prioridade
    const matchesPriority = priority === 'all' || task.priority === priority;
    
    // Filtro de categoria
    const matchesCategory = category === 'all' || task.category === category;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });
};

// Obter categorias únicas de uma lista de tarefas
export const getUniqueCategories = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  const categories = tasks
    .map(task => task.category)
    .filter(category => category && category.trim() !== '');
    
  return [...new Set(categories)];
};

// Validar dados de uma tarefa
export const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || task.title.trim() === '') {
    errors.push('Título é obrigatório');
  }
  
  if (task.title && task.title.length > 100) {
    errors.push('Título deve ter no máximo 100 caracteres');
  }
  
  if (task.description && task.description.length > 500) {
    errors.push('Descrição deve ter no máximo 500 caracteres');
  }
  
  if (!['low', 'medium', 'high'].includes(task.priority)) {
    errors.push('Prioridade inválida');
  }
  
  if (!['todo', 'in-progress', 'done'].includes(task.status)) {
    errors.push('Status inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Ordenar tarefas por diferentes critérios
export const sortTasks = (tasks, sortBy = 'createdAt', order = 'desc') => {
  const sortedTasks = [...tasks];
  
  sortedTasks.sort((a, b) => {
    let valueA, valueB;
    
    switch(sortBy) {
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valueA = priorityOrder[a.priority];
        valueB = priorityOrder[b.priority];
        break;
      case 'dueDate':
        valueA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        valueB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        break;
      case 'createdAt':
      default:
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
    }
    
    if (order === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
  
  return sortedTasks;
};