export type Language = 'en-US' | 'pt-BR';

export const translations = {
  'en-US': {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      backToHome: 'Back to Home',
    },

    // Landing Page
    landing: {
      title: 'Shared Todo - Plan Together',
      subtitle: 'The perfect way to manage shared tasks with your partner',
      description: 'Stay organized, share responsibilities, and never miss important tasks together.',
      signIn: 'Sign In',
      getStarted: 'Get Started Free',
      features: {
        sharing: {
          title: 'Real-time Sharing',
          description: 'Share todos instantly with your partner',
        },
        notifications: {
          title: 'Smart Reminders',
          description: 'Never miss important tasks with notifications',
        },
        organize: {
          title: 'Stay Organized',
          description: 'Filter, search, and manage todos efficiently',
        },
      },
    },

    // Authentication
    auth: {
      // Login
      login: {
        title: 'Welcome back!',
        subtitle: 'Sign in to your account to continue',
        email: 'Email',
        password: 'Password',
        emailPlaceholder: 'you@example.com',
        passwordPlaceholder: '••••••••',
        signIn: 'Sign In',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
      },

      // Register
      register: {
        title: 'Create your account',
        subtitle: 'Start managing todos together',
        displayName: 'Display Name',
        displayNamePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        createAccount: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
      },

      // Forgot Password
      forgotPassword: {
        title: 'Reset Password',
        subtitle: 'Password reset feature coming soon!',
        message: 'This feature is currently under development. For now, please contact support if you need to reset your password.',
        backToSignIn: 'Back to Sign In',
        returnToSignIn: 'Return to Sign In',
      },

      // Settings
      settings: {
        title: 'Settings',
        profile: 'Profile Settings',
        displayName: 'Display Name',
        phoneNumber: 'Phone Number (optional)',
        phoneNumberPlaceholder: '+1 (555) 000-0000',
        updateProfile: 'Update Profile',
        signOut: 'Sign Out',
      },
    },

    // Todos
    todos: {
      title: 'My Todos',
      welcome: 'Welcome back,',
      newTodo: 'New Todo',
      searchPlaceholder: 'Search todos...',

      // Filters
      filters: {
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        mine: 'Mine',
      },

      // Stats
      stats: {
        active: 'active',
        completed: 'completed',
      },

      // Form
      form: {
        createTitle: 'Create New Todo',
        editTitle: 'Edit Todo',
        title: 'Title',
        titlePlaceholder: 'What needs to be done?',
        description: 'Description (optional)',
        descriptionPlaceholder: 'Add more details...',
        dueDate: 'Due Date (optional)',
        dueTime: 'Due Time (optional)',
        createTodo: 'Create Todo',
        updateTodo: 'Update Todo',
        cancel: 'Cancel',
        titleRequired: 'Title is required',
      },

      // Card
      card: {
        edit: 'Edit',
        delete: 'Delete',
        overdue: 'Overdue',
        confirmDelete: 'Delete this todo?',
        yesDelete: 'Yes, delete',
        sharedWith: 'Shared with',
        person: 'person',
        people: 'people',
      },

      // Empty states
      empty: {
        noTodos: 'No todos yet',
        noCompleted: 'No completed todos yet',
        noMatching: 'No matching todos',
        createFirst: 'Create your first todo to get started!',
        tryDifferent: 'Try a different search term',
      },

      // Participants
      participants: {
        sharedWith: 'Shared with',
        addPerson: '+ Add Person',
        cancel: 'Cancel',
        searchPlaceholder: 'Search by name or email...',
        noUsersFound: 'No users found',
        notShared: 'Not shared with anyone yet',
        you: '(You)',
        canEdit: 'Can edit',
        viewOnly: 'View only',
        makeViewer: 'Make viewer',
        makeEditor: 'Make editor',
        remove: 'Remove',
        confirmRemove: 'Remove this participant?',
      },
    },

    // 404 Page
    notFound: {
      title: 'Page Not Found',
      message: "Oops! The page you're looking for doesn't exist. It might have been moved or deleted.",
      backToHome: 'Back to Home',
      goToTodos: 'Go to Todos',
    },
  },

  'pt-BR': {
    // Common
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      yes: 'Sim',
      no: 'Não',
      search: 'Pesquisar',
      filter: 'Filtrar',
      all: 'Todos',
      backToHome: 'Voltar ao Início',
    },

    // Landing Page
    landing: {
      title: 'Shared Todo - Planeje Juntos',
      subtitle: 'A maneira perfeita de gerenciar tarefas compartilhadas com seu parceiro',
      description: 'Mantenha-se organizado, compartilhe responsabilidades e nunca perca tarefas importantes juntos.',
      signIn: 'Entrar',
      getStarted: 'Começar Grátis',
      features: {
        sharing: {
          title: 'Compartilhamento em Tempo Real',
          description: 'Compartilhe tarefas instantaneamente com seu parceiro',
        },
        notifications: {
          title: 'Lembretes Inteligentes',
          description: 'Nunca perca tarefas importantes com notificações',
        },
        organize: {
          title: 'Mantenha-se Organizado',
          description: 'Filtre, pesquise e gerencie tarefas eficientemente',
        },
      },
    },

    // Authentication
    auth: {
      // Login
      login: {
        title: 'Bem-vindo de volta!',
        subtitle: 'Entre na sua conta para continuar',
        email: 'E-mail',
        password: 'Senha',
        emailPlaceholder: 'voce@exemplo.com',
        passwordPlaceholder: '••••••••',
        signIn: 'Entrar',
        forgotPassword: 'Esqueceu a senha?',
        noAccount: 'Não tem uma conta?',
        signUp: 'Cadastre-se',
      },

      // Register
      register: {
        title: 'Crie sua conta',
        subtitle: 'Comece a gerenciar tarefas juntos',
        displayName: 'Nome de Exibição',
        displayNamePlaceholder: 'Seu nome',
        email: 'E-mail',
        emailPlaceholder: 'voce@exemplo.com',
        password: 'Senha',
        passwordPlaceholder: '••••••••',
        createAccount: 'Criar Conta',
        haveAccount: 'Já tem uma conta?',
        signIn: 'Entrar',
      },

      // Forgot Password
      forgotPassword: {
        title: 'Redefinir Senha',
        subtitle: 'Recurso de redefinição de senha em breve!',
        message: 'Este recurso está atualmente em desenvolvimento. Por enquanto, entre em contato com o suporte se precisar redefinir sua senha.',
        backToSignIn: 'Voltar ao Login',
        returnToSignIn: 'Retornar ao Login',
      },

      // Settings
      settings: {
        title: 'Configurações',
        profile: 'Configurações do Perfil',
        displayName: 'Nome de Exibição',
        phoneNumber: 'Telefone (opcional)',
        phoneNumberPlaceholder: '+55 (11) 00000-0000',
        updateProfile: 'Atualizar Perfil',
        signOut: 'Sair',
      },
    },

    // Todos
    todos: {
      title: 'Minhas Tarefas',
      welcome: 'Bem-vindo de volta,',
      newTodo: 'Nova Tarefa',
      searchPlaceholder: 'Pesquisar tarefas...',

      // Filters
      filters: {
        all: 'Todas',
        active: 'Ativas',
        completed: 'Concluídas',
        mine: 'Minhas',
      },

      // Stats
      stats: {
        active: 'ativas',
        completed: 'concluídas',
      },

      // Form
      form: {
        createTitle: 'Criar Nova Tarefa',
        editTitle: 'Editar Tarefa',
        title: 'Título',
        titlePlaceholder: 'O que precisa ser feito?',
        description: 'Descrição (opcional)',
        descriptionPlaceholder: 'Adicione mais detalhes...',
        dueDate: 'Data de Vencimento (opcional)',
        dueTime: 'Horário de Vencimento (opcional)',
        createTodo: 'Criar Tarefa',
        updateTodo: 'Atualizar Tarefa',
        cancel: 'Cancelar',
        titleRequired: 'Título é obrigatório',
      },

      // Card
      card: {
        edit: 'Editar',
        delete: 'Excluir',
        overdue: 'Atrasada',
        confirmDelete: 'Excluir esta tarefa?',
        yesDelete: 'Sim, excluir',
        sharedWith: 'Compartilhada com',
        person: 'pessoa',
        people: 'pessoas',
      },

      // Empty states
      empty: {
        noTodos: 'Nenhuma tarefa ainda',
        noCompleted: 'Nenhuma tarefa concluída ainda',
        noMatching: 'Nenhuma tarefa encontrada',
        createFirst: 'Crie sua primeira tarefa para começar!',
        tryDifferent: 'Tente um termo de pesquisa diferente',
      },

      // Participants
      participants: {
        sharedWith: 'Compartilhada com',
        addPerson: '+ Adicionar Pessoa',
        cancel: 'Cancelar',
        searchPlaceholder: 'Pesquisar por nome ou e-mail...',
        noUsersFound: 'Nenhum usuário encontrado',
        notShared: 'Não compartilhada com ninguém ainda',
        you: '(Você)',
        canEdit: 'Pode editar',
        viewOnly: 'Apenas visualizar',
        makeViewer: 'Tornar visualizador',
        makeEditor: 'Tornar editor',
        remove: 'Remover',
        confirmRemove: 'Remover este participante?',
      },
    },

    // 404 Page
    notFound: {
      title: 'Página Não Encontrada',
      message: 'Ops! A página que você está procurando não existe. Ela pode ter sido movida ou excluída.',
      backToHome: 'Voltar ao Início',
      goToTodos: 'Ir para Tarefas',
    },
  },
} as const;

export type TranslationKey = typeof translations['en-US'];
