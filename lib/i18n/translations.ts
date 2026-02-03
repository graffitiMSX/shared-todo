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

      // Metadata
      metadata: {
        title: 'Additional Information',
        addNew: '+ Add Information',
        empty: 'No additional information yet',
        typeLabel: 'Type',
        labelField: 'Label (optional)',
        valueField: 'Value',
        add: 'Add',
        update: 'Update',
        call: 'Call',
        open: 'Open',
        openMaps: 'Open Maps',
        confirmDelete: 'Delete this information?',
        deleteError: 'Failed to delete',
        saveError: 'Failed to save',
        valueRequired: 'Value is required',
        invalidPhone: 'Invalid phone number format',
        invalidLink: 'Invalid link format',
        phonePlaceholder: '+1 (555) 123-4567',
        linkPlaceholder: 'https://example.com',
        addressPlaceholder: '123 Main St, City, State',
        notePlaceholder: 'Additional notes...',
        phoneLabelPlaceholder: 'e.g., Dentist office',
        linkLabelPlaceholder: 'e.g., Reservation link',
        addressLabelPlaceholder: 'e.g., Restaurant location',
        noteLabelPlaceholder: 'e.g., Important info',
      },

      // Checklist
      checklist: {
        title: 'Checklist',
        addNew: '+ Add Item',
        empty: 'No checklist items yet',
        add: 'Add',
        textPlaceholder: 'e.g., Buy milk',
        textRequired: 'Text is required',
        confirmDelete: 'Delete this item?',
        deleteError: 'Failed to delete',
        saveError: 'Failed to save',
      },

      // Notifications
      notifications: {
        title: 'Reminders',
        addNew: '+ Add Reminder',
        empty: 'No reminders set',
        add: 'Add Reminder',
        update: 'Update Reminder',
        remindMe: 'Remind me',
        type: 'Notification type',
        messageLabel: 'Custom message',
        messagePlaceholder: 'e.g., Don\'t forget!',
        optional: 'optional',
        minutesBefore: 'Minutes before due',
        requiresDueDate: 'Set a due date to add reminders',
        presets: {
          '15min': '15 min before',
          '1hour': '1 hour before',
          '1day': '1 day before',
          custom: 'Custom',
        },
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

      // Metadata
      metadata: {
        title: 'Informações Adicionais',
        addNew: '+ Adicionar Informação',
        empty: 'Nenhuma informação adicional ainda',
        typeLabel: 'Tipo',
        labelField: 'Rótulo (opcional)',
        valueField: 'Valor',
        add: 'Adicionar',
        update: 'Atualizar',
        call: 'Ligar',
        open: 'Abrir',
        openMaps: 'Abrir Mapas',
        confirmDelete: 'Excluir esta informação?',
        deleteError: 'Falha ao excluir',
        saveError: 'Falha ao salvar',
        valueRequired: 'Valor é obrigatório',
        invalidPhone: 'Formato de telefone inválido',
        invalidLink: 'Formato de link inválido',
        phonePlaceholder: '+55 (11) 91234-5678',
        linkPlaceholder: 'https://exemplo.com',
        addressPlaceholder: 'Rua Principal 123, Cidade, Estado',
        notePlaceholder: 'Notas adicionais...',
        phoneLabelPlaceholder: 'ex: Consultório do dentista',
        linkLabelPlaceholder: 'ex: Link da reserva',
        addressLabelPlaceholder: 'ex: Localização do restaurante',
        noteLabelPlaceholder: 'ex: Informação importante',
      },

      // Checklist
      checklist: {
        title: 'Lista de Verificação',
        addNew: '+ Adicionar Item',
        empty: 'Nenhum item na lista ainda',
        add: 'Adicionar',
        textPlaceholder: 'ex: Comprar leite',
        textRequired: 'Texto é obrigatório',
        confirmDelete: 'Excluir este item?',
        deleteError: 'Falha ao excluir',
        saveError: 'Falha ao salvar',
      },

      // Notifications
      notifications: {
        title: 'Lembretes',
        addNew: '+ Adicionar Lembrete',
        empty: 'Nenhum lembrete definido',
        add: 'Adicionar Lembrete',
        update: 'Atualizar Lembrete',
        remindMe: 'Me lembre',
        type: 'Tipo de notificação',
        messageLabel: 'Mensagem personalizada',
        messagePlaceholder: 'ex: Não esqueça!',
        optional: 'opcional',
        minutesBefore: 'Minutos antes do vencimento',
        requiresDueDate: 'Defina uma data de vencimento para adicionar lembretes',
        presets: {
          '15min': '15 min antes',
          '1hour': '1 hora antes',
          '1day': '1 dia antes',
          custom: 'Personalizado',
        },
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
