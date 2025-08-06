import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Check, X, Edit2, Trash2, Calendar, Flag, User, Moon, Sun, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TaskFlow = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Implementar sistema de autenticação',
      description: 'Criar login e registro com validação',
      priority: 'high',
      category: 'Desenvolvimento',
      status: 'todo',
      createdAt: new Date('2025-01-06'),
      dueDate: new Date('2025-01-10')
    },
    {
      id: '2',
      title: 'Revisar documentação da API',
      description: 'Atualizar endpoints e exemplos',
      priority: 'medium',
      category: 'Documentação',
      status: 'in-progress',
      createdAt: new Date('2025-01-05'),
      dueDate: new Date('2025-01-08')
    },
    {
      id: '3',
      title: 'Testes unitários componentes',
      description: 'Criar testes para todos os componentes React',
      priority: 'high',
      category: 'Desenvolvimento',
      status: 'done',
      createdAt: new Date('2025-01-04'),
      dueDate: new Date('2025-01-07')
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' ou 'list'
  const [draggedTask, setDraggedTask] = useState(null);

  // Formulário para nova tarefa
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
    status: 'todo'
  });

  // Colunas do Kanban
  const columns = [
    { id: 'todo', title: 'A Fazer', icon: Clock, color: 'bg-blue-500' },
    { id: 'in-progress', title: 'Em Progresso', icon: AlertCircle, color: 'bg-yellow-500' },
    { id: 'done', title: 'Concluído', icon: CheckCircle, color: 'bg-green-500' }
  ];

  // Inicializar tema do localStorage (simulado)
  useEffect(() => {
    // Em um projeto real, isso viria do localStorage
    // const savedTheme = localStorage.getItem('taskflow-theme');
    // setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Salvar tema no localStorage (simulado)
  useEffect(() => {
    // Em um projeto real, isso salvaria no localStorage
    // localStorage.setItem('taskflow-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Função para alternar tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Função para gerar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Função para adicionar/editar tarefa
  const handleSaveTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;

    const taskData = {
      id: editingTask ? editingTask.id : generateId(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category || 'Geral',
      status: newTask.status,
      createdAt: editingTask ? editingTask.createdAt : new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
    };

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? taskData : task
      ));
    } else {
      setTasks([...tasks, taskData]);
    }

    resetForm();
  };

  // Função para resetar formulário
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
      status: 'todo'
    });
    setEditingTask(null);
    setIsModalOpen(false);
  };

  // Função para deletar tarefa
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Função para editar tarefa
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      status: task.status
    });
    setIsModalOpen(true);
  };

  // Drag & Drop functions
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus }
          : task
      ));
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  // Filtrar tarefas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Obter categorias únicas
  const uniqueCategories = [...new Set(tasks.map(task => task.category))];

  // Função para obter cor da prioridade
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Função para verificar se está atrasado
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Estatísticas
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done').length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  TaskFlow
                </h1>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Gerencie suas tarefas com eficiência
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center space-x-2">
                <Sun className={`h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-yellow-500'
                }`} />
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-indigo-600 focus:ring-offset-gray-800' 
                      : 'bg-gray-200 focus:ring-offset-white'
                  }`}
                >
                  <span className="sr-only">Toggle theme</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Moon className={`h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-indigo-400' : 'text-gray-400'
                }`} />
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Tarefa</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  A Fazer
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.todo}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Em Progresso
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.inProgress}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Concluído
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.done}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Atrasadas
                </p>
                <p className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.overdue}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stats.overdue > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <Calendar className={`h-6 w-6 ${stats.overdue > 0 ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={`rounded-lg shadow-md p-4 mb-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Todas as prioridades</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
              <select
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = filteredTasks.filter(task => task.status === column.id);
              const IconComponent = column.icon;
              
              return (
                <div
                  key={column.id}
                  className={`rounded-lg p-4 transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow-md min-h-96`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 ${column.color} rounded`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {column.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 rounded-lg border-l-4 cursor-move transition-all duration-200 hover:shadow-md ${
                          task.priority === 'high' ? 'border-red-500' :
                          task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                        } ${
                          isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-650' 
                            : 'bg-gray-50 hover:bg-white'
                        } ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {task.title}
                          </h4>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditTask(task)}
                              className={`p-1 transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:text-indigo-400' 
                                  : 'text-gray-400 hover:text-indigo-600'
                              }`}
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className={`p-1 transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:text-red-400' 
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className={`flex items-center justify-between text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{task.category}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          </div>
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${
                              isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-500' : ''
                            }`}>
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {columnTasks.length === 0 && (
                      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <p className="text-sm">Nenhuma tarefa</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Lista tradicional
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className={`rounded-lg shadow-md p-8 transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className={`mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Check className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Nenhuma tarefa encontrada
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {searchTerm || filterPriority !== 'all' || filterCategory !== 'all'
                      ? 'Tente ajustar os filtros para encontrar suas tarefas.'
                      : 'Crie sua primeira tarefa para começar!'}
                  </p>
                </div>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`mt-2 w-3 h-3 rounded-full ${
                        task.status === 'done' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        </div>
                        <p className={`mb-3 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                        <div className={`flex items-center space-x-4 text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{task.category}</span>
                          </div>
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${
                              isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-500' : ''
                            }`}>
                              <Calendar className="h-4 w-4" />
                              <span>{task.dueDate.toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Flag className="h-4 w-4" />
                            <span className="capitalize">{task.priority}</span>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {task.status === 'done' ? 'Concluído' :
                             task.status === 'in-progress' ? 'Em Progresso' : 'A Fazer'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className={`p-2 transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-indigo-400' 
                            : 'text-gray-400 hover:text-indigo-600'
                        }`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className={`p-2 transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal para Nova/Editar Tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl max-w-md w-full transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <button
                  onClick={resetForm}
                  className={`transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Descrição
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows="3"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Prioridade
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                      <option value="todo">A Fazer</option>
                      <option value="in-progress">Em Progresso</option>
                      <option value="done">Concluído</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Categoria
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveTask}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFlow;