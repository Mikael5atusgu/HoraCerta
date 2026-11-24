(() => {
  const dictionaries = {
    es: {
      'Acessar sistema': 'Iniciar sesión',
      'Entre para consultar a rotina da sua escola.': 'Inicia sesión para consultar la rutina de tu escuela.',
      'E-mail': 'Correo electrónico',
      'seu.email@escola.com': 'tu.correo@escuela.com',
      'Senha': 'Contraseña',
      'Sua senha': 'Tu contraseña',
      'Perfil': 'Perfil',
      'HoraCerta início': 'Inicio de HoraCerta',
      'Aluno': 'Estudiante',
      'Professor': 'Profesor',
      'Coordenador': 'Coordinador',
      'Administrador': 'Administrador',
      'Mostrar': 'Mostrar',
      'Ocultar': 'Ocultar',
      'Mostrar senha': 'Mostrar contraseña',
      'Ocultar senha': 'Ocultar contraseña',
      'Entrar no sistema': 'Iniciar sesión',
      'Acesso de demonstração': 'Acceso de demostración',
      'Senha de teste:': 'Contraseña de prueba:',
      'Coordenação': 'Coordinación',
      'Admin': 'Admin',
      'Ações rápidas': 'Acciones rápidas',
      'Ações do perfil': 'Acciones del perfil',
      'Categorias': 'Categorías',
      'Aulas': 'Clases',
      'Provas e trabalhos': 'Exámenes y trabajos',
      'Feriados': 'Festivos',
      'Eventos escolares': 'Eventos escolares',
      'Últimos avisos': 'Últimos avisos',
      'Sair': 'Cerrar sesión',
      'Agenda escolar': 'Agenda escolar',
      'Mês': 'Mes',
      'Semana': 'Semana',
      'Hoje': 'Hoy',
      'Visualização do calendário': 'Vista del calendario',
      'Alternar tema': 'Cambiar tema',
      'Calendário': 'Calendario',
      'Período anterior': 'Periodo anterior',
      'Próximo período': 'Periodo siguiente',
      'Dispensar aviso': 'Descartar aviso',
      'Aula': 'Clase',
      'Prova': 'Examen',
      'Trabalho': 'Trabajo',
      'Feriado': 'Festivo',
      'Evento escolar': 'Evento escolar',
      'Prova / trabalho': 'Examen / trabajo',
      'Feriado': 'Festivo',
      'Evento escolar': 'Evento escolar',
      'Aula vaga': 'Clase disponible',
      'Nenhum aviso publicado.': 'No hay avisos publicados.',
      'Ativar tema escuro': 'Activar tema oscuro',
      'Ativar tema claro': 'Activar tema claro',
      'Tema escuro': 'Tema oscuro',
      'Tema claro': 'Tema claro',
      'Idioma: português': 'Idioma: español',
      'Idioma: español': 'Idioma: español',
      'Idioma: english': 'Idioma: inglés',
      'Selecionar idioma': 'Seleccionar idioma',
      'Reportar problema / sugestão': 'Informar problema / sugerencia',
      'Novo evento / prova': 'Nuevo evento / examen',
      'Pegar aula vaga': 'Solicitar clase disponible',
      'Reportar problema': 'Informar problema',
      'Novo evento': 'Nuevo evento',
      'Aprovar trocas': 'Aprobar cambios',
      'Bloquear horário': 'Bloquear horario',
      'Emitir aviso geral': 'Publicar aviso general',
      'Gerenciar usuários': 'Gestionar usuarios',
      'Ver feedbacks': 'Ver comentarios',
      'Trilha de auditoria': 'Registro de auditoría',
      'Entrando...': 'Iniciando sesión...',
      'Título': 'Título',
      'Ex.: Evento na quadra': 'Ej.: Evento en la cancha',
      'Ex.: Prova de Matemática': 'Ej.: Examen de Matemáticas',
      'Categoria': 'Categoría',
      'Turma': 'Clase',
      'Início': 'Inicio',
      'Fim': 'Fin',
      'Disciplina / local': 'Asignatura / lugar',
      'Ex.: Quadra': 'Ej.: Cancha',
      'Ex.: Matemática': 'Ej.: Matemáticas',
      'Descrição': 'Descripción',
      'O horário bloqueado ficará visível no calendário.': 'El horario bloqueado será visible en el calendario.',
      'Os eventos publicados aparecem imediatamente para a escola.': 'Los eventos publicados aparecen inmediatamente para la escuela.',
      'Cancelar': 'Cancelar',
      'Salvar alterações': 'Guardar cambios',
      'Salvar evento': 'Guardar evento',
      'Enviar feedback': 'Enviar comentario',
      'Sua mensagem será encaminhada à administração da escola.': 'Tu mensaje se enviará a la administración de la escuela.',
      'Tipo de relato': 'Tipo de comentario',
      'Problema no horário': 'Problema con el horario',
      'Sugestão': 'Sugerencia',
      'Mensagem': 'Mensaje',
      'Conte o que aconteceu ou compartilhe sua sugestão.': 'Cuéntanos qué pasó o comparte tu sugerencia.',
      'Emitir aviso geral': 'Publicar aviso general',
      'O aviso ficará visível para todos os perfis.': 'El aviso será visible para todos los perfiles.',
      'Ex.: Alteração de horário': 'Ej.: Cambio de horario',
      'Escreva o aviso para a comunidade escolar.': 'Escribe el aviso para la comunidad escolar.',
      'Publicar aviso': 'Publicar aviso',
      'Cadastrar usuário': 'Registrar usuario',
      'O acesso será vinculado ao perfil escolhido.': 'El acceso estará vinculado al perfil seleccionado.',
      'Nome': 'Nombre',
      'Nome completo': 'Nombre completo',
      'Senha temporária': 'Contraseña temporal',
      'Mínimo de 10 caracteres': 'Mínimo de 10 caracteres',
      'Turma (aluno/professor)': 'Clase (estudiante/profesor)',
      'Ex.: 2º Ano A': 'Ej.: 2.º Año A',
      'Cadastrar': 'Registrar',
      'Turma não informada': 'Clase no indicada',
      'Solicitar': 'Solicitar',
      'Não há aulas vagas disponíveis neste período.': 'No hay clases disponibles en este periodo.',
      'Aulas vagas': 'Clases disponibles',
      'Envie uma solicitação para análise da coordenação.': 'Envía una solicitud para que la coordinación la revise.',
      'Solicitações pendentes': 'Solicitudes pendientes',
      'Revise e decida sobre as substituições de aula.': 'Revisa y decide sobre las sustituciones de clases.',
      'Carregando solicitações...': 'Cargando solicitudes...',
      'Não há solicitações aguardando análise.': 'No hay solicitudes pendientes de revisión.',
      'Aprovar': 'Aprobar',
      'Recusar': 'Rechazar',
      'Cadastre contas e defina os perfis de acesso.': 'Registra cuentas y define los perfiles de acceso.',
      '+ Novo usuário': '+ Nuevo usuario',
      'Usuários cadastrados': 'Usuarios registrados',
      'Usuários cadastrados no HoraCerta': 'Usuarios registrados en HoraCerta',
      'Nenhum usuário cadastrado.': 'No hay usuarios registrados.',
      'Turma': 'Clase',
      'Feedbacks dos alunos': 'Comentarios de estudiantes',
      'Problema': 'Problema',
      'Nenhum feedback recebido.': 'No se han recibido comentarios.',
      'Carregando feedbacks...': 'Cargando comentarios...',
      'Trilha de auditoria': 'Registro de auditoría',
      'Últimas ações administrativas registradas.': 'Últimas acciones administrativas registradas.',
      'Carregando registros...': 'Cargando registros...',
      'Nenhuma ação registrada.': 'No hay acciones registradas.',
      'Sistema': 'Sistema',
      'Detalhes do evento': 'Detalles del evento',
      'Sem disciplina': 'Sin asignatura',
      'Todas as turmas': 'Todos los grupos',
      'Excluir evento': 'Eliminar evento',
      'Editar evento': 'Editar evento',
      'Fechar': 'Cerrar',
      'Excluir evento?': '¿Eliminar evento?',
      'Confirme a remoção de': 'Confirma la eliminación de',
      'Esta ação removerá o evento do calendário e não poderá ser desfeita.': 'Esta acción eliminará el evento del calendario y no se podrá deshacer.',
      'Continuar': 'Continuar',
      'Confirmação final': 'Confirmación final',
      'Para continuar, digite CONFIRMAR.': 'Para continuar, escribe CONFIRMAR.',
      'Digite CONFIRMAR': 'Escribe CONFIRMAR',
      'Excluir definitivamente': 'Eliminar definitivamente',
      'Alterações salvas.': 'Cambios guardados.',
      'Evento publicado no calendário.': 'Evento publicado en el calendario.',
      'Feedback enviado. Obrigado!': 'Comentario enviado. ¡Gracias!',
      'Aviso publicado para a escola.': 'Aviso publicado para la escuela.',
      'Usuário cadastrado com sucesso.': 'Usuario registrado correctamente.',
      'Digite CONFIRMAR para remover o evento.': 'Escribe CONFIRMAR para eliminar el evento.',
      'Evento removido e ação registrada na auditoria.': 'Evento eliminado y acción registrada en la auditoría.',
      'Solicitação enviada com sucesso!': '¡Solicitud enviada correctamente!',
      'Solicitação aprovado.': 'Solicitud aprobada.',
      'Solicitação recusado.': 'Solicitud rechazada.',
      'Solicitação aprovada.': 'Solicitud aprobada.',
      'Solicitação recusada.': 'Solicitud rechazada.',
      'Digite CONFIRM para remover o evento.': 'Escribe CONFIRM para eliminar el evento.',
      'Aula Vaga - História': 'Clase disponible - Historia',
      'Aula de Matemática': 'Clase de Matemáticas',
      'Prova de Matemática': 'Examen de Matemáticas',
      'Feira de Ciências': 'Feria de ciencias',
      'Feriado Municipal': 'Festivo municipal',
      'Bem-vindo ao HoraCerta': 'Te damos la bienvenida a HoraCerta',
      'Confira o calendario e os avisos da sua escola.': 'Consulta el calendario y los avisos de tu escuela.',
      'Acesso negado.': 'Acceso denegado.',
      'Informe e-mail e senha.': 'Indica el correo electrónico y la contraseña.',
      'E-mail, senha ou perfil incorretos.': 'El correo, la contraseña o el perfil son incorrectos.',
      'Informe um nome valido.': 'Indica un nombre válido.',
      'Informe um e-mail valido.': 'Indica un correo electrónico válido.',
      'A senha deve ter pelo menos 10 caracteres.': 'La contraseña debe tener al menos 10 caracteres.',
      'Selecione um perfil valido.': 'Selecciona un perfil válido.',
      'Este e-mail ja esta cadastrado.': 'Este correo ya está registrado.',
      'Informe titulo e mensagem validos.': 'Indica un título y un mensaje válidos.',
      'Informe um intervalo de datas valido.': 'Indica un intervalo de fechas válido.',
      'Informe mes e ano validos.': 'Indica un mes y un año válidos.',
      'Seu perfil ainda nao tem uma turma atribuida.': 'Tu perfil aún no tiene una clase asignada.',
      'Evento nao encontrado.': 'No se encontró el evento.',
      'Professores so podem editar eventos que cadastraram.': 'Los profesores solo pueden editar los eventos que crearon.',
      'A mensagem deve ter entre 5 e 1000 caracteres.': 'El mensaje debe tener entre 5 y 1000 caracteres.',
      'Selecione problema ou sugestao.': 'Selecciona problema o sugerencia.',
      'Esta aula vaga nao esta mais disponivel.': 'Esta clase ya no está disponible.',
      'Voce ja solicitou esta aula.': 'Ya solicitaste esta clase.',
      'Solicitacao enviada para a coordenacao.': 'Solicitud enviada a coordinación.',
      'Esta solicitacao ja foi enviada.': 'Esta solicitud ya fue enviada.',
      'A decisao deve ser aprovado ou recusado.': 'La decisión debe ser aprobada o rechazada.',
      'Solicitacao pendente nao encontrada.': 'No se encontró la solicitud pendiente.',
      'Para continuar, digite CONFIRMAR.': 'Para continuar, escribe CONFIRMAR.',
      'Para continuar, digite CONFIRM.': 'Para continuar, escribe CONFIRM.',
      'Digite CONFIRMAR': 'Escribe CONFIRMAR',
      'Digite CONFIRM': 'Escribe CONFIRM',
      'Sua sessão expirou. Entre novamente.': 'Tu sesión ha caducado. Inicia sesión de nuevo.',
      'Não foi possível concluir a operação.': 'No se pudo completar la operación.',
      'Muitas tentativas. Tente novamente mais tarde.': 'Demasiados intentos. Vuelve a intentarlo más tarde.',
      'Rota da API nao encontrada.': 'No se encontró la ruta de la API.',
      'Erro interno. Tente novamente.': 'Error interno. Vuelve a intentarlo.'
    },
    en: {
      'Acessar sistema': 'Sign in',
      'Entre para consultar a rotina da sua escola.': 'Sign in to check your school schedule.',
      'E-mail': 'Email',
      'seu.email@escola.com': 'your.email@school.com',
      'Senha': 'Password',
      'Sua senha': 'Your password',
      'Perfil': 'Role',
      'HoraCerta início': 'HoraCerta home',
      'Aluno': 'Student',
      'Professor': 'Teacher',
      'Coordenador': 'Coordinator',
      'Administrador': 'Administrator',
      'Mostrar': 'Show',
      'Ocultar': 'Hide',
      'Mostrar senha': 'Show password',
      'Ocultar senha': 'Hide password',
      'Entrar no sistema': 'Sign in',
      'Acesso de demonstração': 'Demo access',
      'Senha de teste:': 'Demo password:',
      'Coordenação': 'Coordination',
      'Admin': 'Admin',
      'Ações rápidas': 'Quick actions',
      'Ações do perfil': 'Role actions',
      'Categorias': 'Categories',
      'Aulas': 'Classes',
      'Provas e trabalhos': 'Exams and assignments',
      'Feriados': 'Holidays',
      'Eventos escolares': 'School events',
      'Últimos avisos': 'Latest announcements',
      'Sair': 'Sign out',
      'Agenda escolar': 'School calendar',
      'Mês': 'Month',
      'Semana': 'Week',
      'Hoje': 'Today',
      'Visualização do calendário': 'Calendar view',
      'Alternar tema': 'Toggle theme',
      'Calendário': 'Calendar',
      'Período anterior': 'Previous period',
      'Próximo período': 'Next period',
      'Dispensar aviso': 'Dismiss announcement',
      'Aula': 'Class',
      'Prova': 'Exam',
      'Trabalho': 'Assignment',
      'Feriado': 'Holiday',
      'Evento escolar': 'School event',
      'Prova / trabalho': 'Exam / assignment',
      'Aula vaga': 'Available class',
      'Nenhum aviso publicado.': 'No announcements have been published.',
      'Ativar tema escuro': 'Enable dark theme',
      'Ativar tema claro': 'Enable light theme',
      'Tema escuro': 'Dark theme',
      'Tema claro': 'Light theme',
      'Idioma: português': 'Language: Portuguese',
      'Idioma: español': 'Language: Spanish',
      'Idioma: english': 'Language: English',
      'Selecionar idioma': 'Select language',
      'Reportar problema / sugestão': 'Report an issue / suggestion',
      'Novo evento / prova': 'New event / exam',
      'Pegar aula vaga': 'Request available class',
      'Reportar problema': 'Report an issue',
      'Novo evento': 'New event',
      'Aprovar trocas': 'Approve swaps',
      'Bloquear horário': 'Block time slot',
      'Emitir aviso geral': 'Send announcement',
      'Gerenciar usuários': 'Manage users',
      'Ver feedbacks': 'View feedback',
      'Trilha de auditoria': 'Audit log',
      'Entrando...': 'Signing in...',
      'Título': 'Title',
      'Ex.: Evento na quadra': 'e.g. Gym event',
      'Ex.: Prova de Matemática': 'e.g. Math exam',
      'Categoria': 'Category',
      'Turma': 'Class',
      'Início': 'Start',
      'Fim': 'End',
      'Disciplina / local': 'Subject / location',
      'Ex.: Quadra': 'e.g. Gym',
      'Ex.: Matemática': 'e.g. Math',
      'Descrição': 'Description',
      'O horário bloqueado ficará visível no calendário.': 'The blocked time slot will appear on the calendar.',
      'Os eventos publicados aparecem imediatamente para a escola.': 'Published events appear on the school calendar right away.',
      'Cancelar': 'Cancel',
      'Salvar alterações': 'Save changes',
      'Salvar evento': 'Save event',
      'Enviar feedback': 'Send feedback',
      'Sua mensagem será encaminhada à administração da escola.': 'Your message will be sent to the school administration.',
      'Tipo de relato': 'Feedback type',
      'Problema no horário': 'Schedule issue',
      'Sugestão': 'Suggestion',
      'Mensagem': 'Message',
      'Conte o que aconteceu ou compartilhe sua sugestão.': 'Tell us what happened or share your suggestion.',
      'O aviso ficará visível para todos os perfis.': 'The announcement will be visible to all roles.',
      'Ex.: Alteração de horário': 'e.g. Schedule change',
      'Escreva o aviso para a comunidade escolar.': 'Write an announcement for the school community.',
      'Publicar aviso': 'Publish announcement',
      'Cadastrar usuário': 'Add user',
      'O acesso será vinculado ao perfil escolhido.': 'Access will be linked to the selected role.',
      'Nome': 'Name',
      'Nome completo': 'Full name',
      'Senha temporária': 'Temporary password',
      'Mínimo de 10 caracteres': 'At least 10 characters',
      'Turma (aluno/professor)': 'Class (student/teacher)',
      'Ex.: 2º Ano A': 'e.g. Grade 2 A',
      'Cadastrar': 'Add user',
      'Turma não informada': 'Class not specified',
      'Solicitar': 'Request',
      'Não há aulas vagas disponíveis neste período.': 'No available classes during this period.',
      'Aulas vagas': 'Available classes',
      'Envie uma solicitação para análise da coordenação.': 'Send a request for the coordinator to review.',
      'Solicitações pendentes': 'Pending requests',
      'Revise e decida sobre as substituições de aula.': 'Review and decide on class substitutions.',
      'Carregando solicitações...': 'Loading requests...',
      'Não há solicitações aguardando análise.': 'There are no requests awaiting review.',
      'Aprovar': 'Approve',
      'Recusar': 'Reject',
      'Cadastre contas e defina os perfis de acesso.': 'Create accounts and assign access roles.',
      '+ Novo usuário': '+ New user',
      'Usuários cadastrados': 'Registered users',
      'Usuários cadastrados no HoraCerta': 'Registered HoraCerta users',
      'Nenhum usuário cadastrado.': 'No users have been registered.',
      'Feedbacks dos alunos': 'Student feedback',
      'Problema': 'Issue',
      'Nenhum feedback recebido.': 'No feedback received.',
      'Carregando feedbacks...': 'Loading feedback...',
      'Últimas ações administrativas registradas.': 'Latest recorded administrative actions.',
      'Carregando registros...': 'Loading records...',
      'Nenhuma ação registrada.': 'No actions recorded.',
      'Sistema': 'System',
      'Detalhes do evento': 'Event details',
      'Sem disciplina': 'No subject',
      'Todas as turmas': 'All classes',
      'Excluir evento': 'Delete event',
      'Editar evento': 'Edit event',
      'Fechar': 'Close',
      'Excluir evento?': 'Delete event?',
      'Esta ação removerá o evento do calendário e não poderá ser desfeita.': 'This will remove the event from the calendar and cannot be undone.',
      'Continuar': 'Continue',
      'Confirmação final': 'Final confirmation',
      'Para continuar, digite CONFIRMAR.': 'To continue, type CONFIRM.',
      'Digite CONFIRMAR': 'Type CONFIRM',
      'Excluir definitivamente': 'Delete permanently',
      'Alterações salvas.': 'Changes saved.',
      'Evento publicado no calendário.': 'Event added to the calendar.',
      'Feedback enviado. Obrigado!': 'Feedback sent. Thank you!',
      'Aviso publicado para a escola.': 'Announcement published for the school.',
      'Usuário cadastrado com sucesso.': 'User added successfully.',
      'Digite CONFIRMAR para remover o evento.': 'Type CONFIRM to delete the event.',
      'Evento removido e ação registrada na auditoria.': 'Event deleted and action recorded in the audit log.',
      'Solicitação enviada com sucesso!': 'Request sent successfully!',
      'Solicitação aprovado.': 'Request approved.',
      'Solicitação recusado.': 'Request rejected.',
      'Solicitação aprovada.': 'Request approved.',
      'Solicitação recusada.': 'Request rejected.',
      'Confirme a remoção de': 'Confirm the deletion of',
      'Aula Vaga - História': 'Available class - History',
      'Aula de Matemática': 'Math class',
      'Prova de Matemática': 'Math exam',
      'Feira de Ciências': 'Science fair',
      'Feriado Municipal': 'Local holiday',
      'Bem-vindo ao HoraCerta': 'Welcome to HoraCerta',
      'Confira o calendario e os avisos da sua escola.': 'Check your school calendar and announcements.',
      'Acesso negado.': 'Access denied.',
      'Informe e-mail e senha.': 'Enter your email and password.',
      'E-mail, senha ou perfil incorretos.': 'The email, password, or role is incorrect.',
      'Informe um nome valido.': 'Enter a valid name.',
      'Informe um e-mail valido.': 'Enter a valid email address.',
      'A senha deve ter pelo menos 10 caracteres.': 'The password must be at least 10 characters long.',
      'Selecione um perfil valido.': 'Select a valid role.',
      'Este e-mail ja esta cadastrado.': 'This email is already registered.',
      'Informe titulo e mensagem validos.': 'Enter a valid title and message.',
      'Informe um intervalo de datas valido.': 'Enter a valid date range.',
      'Informe mes e ano validos.': 'Enter a valid month and year.',
      'Seu perfil ainda nao tem uma turma atribuida.': 'Your role does not have a class assigned yet.',
      'Evento nao encontrado.': 'Event not found.',
      'Professores so podem editar eventos que cadastraram.': 'Teachers can only edit events they created.',
      'A mensagem deve ter entre 5 e 1000 caracteres.': 'The message must be between 5 and 1,000 characters.',
      'Selecione problema ou sugestao.': 'Select issue or suggestion.',
      'Esta aula vaga nao esta mais disponivel.': 'This available class is no longer available.',
      'Voce ja solicitou esta aula.': 'You have already requested this class.',
      'Solicitacao enviada para a coordenacao.': 'Request sent to the coordinator.',
      'Esta solicitacao ja foi enviada.': 'This request has already been sent.',
      'A decisao deve ser aprovado ou recusado.': 'The decision must be approve or reject.',
      'Solicitacao pendente nao encontrada.': 'Pending request not found.',
      'Para continuar, digite CONFIRMAR.': 'To continue, type CONFIRM.',
      'Digite CONFIRMAR': 'Type CONFIRM',
      'Sua sessão expirou. Entre novamente.': 'Your session expired. Please sign in again.',
      'Não foi possível concluir a operação.': 'The operation could not be completed.',
      'Muitas tentativas. Tente novamente mais tarde.': 'Too many attempts. Please try again later.',
      'Rota da API nao encontrada.': 'API route not found.',
      'Erro interno. Tente novamente.': 'Internal error. Please try again.'
    }
  };
  const languages = {
    pt: { name: 'Português', htmlLang: 'pt-BR', intlLocale: 'pt-BR', pageTitle: 'HoraCerta — Calendário escolar' },
    es: { name: 'Español', htmlLang: 'es', intlLocale: 'es-ES', pageTitle: 'HoraCerta — Calendario escolar' },
    en: { name: 'English', htmlLang: 'en', intlLocale: 'en-US', pageTitle: 'HoraCerta — School calendar' }
  };
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let locale = 'pt';

  function translate(value, language = locale) {
    const text = String(value);
    const dictionary = dictionaries[language];
    const deletionPrefix = 'Confirme a remoção de ';
    if (dictionary && text.startsWith(deletionPrefix) && text.endsWith('.')) {
      return `${dictionary['Confirme a remoção de'] || 'Confirme a remoção de'} ${text.slice(deletionPrefix.length)}`;
    }
    return dictionary?.[text] || text;
  }

  function translateTextNode(node) {
    if (!node.parentElement || node.parentElement.closest('[data-user-content], [data-user-text]')) return;
    const current = node.nodeValue;
    const record = originalText.get(node);
    const source = record && current === record.translated ? record.source : current;
    if (!source.trim()) return;
    const translated = translate(source.trim());
    const leading = source.match(/^\s*/)[0];
    const trailing = source.match(/\s*$/)[0];
    const next = `${leading}${translated}${trailing}`;
    originalText.set(node, { source, translated: next });
    if (current !== next) node.nodeValue = next;
  }

  function translateAttribute(element, attribute) {
    if (element.closest?.('[data-user-content]')) return;
    const current = element.getAttribute(attribute);
    if (current === null) return;
    let records = originalAttributes.get(element);
    if (!records) {
      records = new Map();
      originalAttributes.set(element, records);
    }
    const record = records.get(attribute);
    const source = record && current === record.translated ? record.source : current;
    const translated = translate(source);
    records.set(attribute, { source, translated });
    if (current !== translated) element.setAttribute(attribute, translated);
  }

  function apply(root = document.documentElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script, style, noscript') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) translateTextNode(walker.currentNode);

    const elements = root.querySelectorAll ? [root, ...root.querySelectorAll('[placeholder], [title], [aria-label]')] : [];
    for (const element of elements) {
      for (const attribute of ['placeholder', 'title', 'aria-label']) translateAttribute(element, attribute);
    }
  }

  function setLocale(language) {
    locale = Object.hasOwn(languages, language) ? language : 'pt';
    document.documentElement.lang = languages[locale].htmlLang;
    document.title = languages[locale].pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = locale === 'en'
        ? 'HoraCerta: school calendar and schedule management.'
        : locale === 'es'
          ? 'HoraCerta: calendario escolar y gestión de horarios.'
          : 'HoraCerta: calendario escolar e gestão de horários.';
    }
    try {
      localStorage.setItem('horacerta-language', locale);
    } catch (error) {
      console.warn('Não foi possível salvar o idioma selecionado.', error);
    }
    apply();
    return locale;
  }

  const savedLanguage = (() => {
    try {
      return localStorage.getItem('horacerta-language') || 'pt';
    } catch (error) {
      console.warn('Não foi possível ler o idioma salvo.', error);
      return 'pt';
    }
  })();
  setLocale(savedLanguage);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateTextNode(mutation.target);
      else if (mutation.type === 'attributes') translateAttribute(mutation.target, mutation.attributeName);
      else {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) apply(node);
          else if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
        }
      }
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label']
  });

  window.HoraCertaI18n = {
    getLocale: () => locale,
    getLanguage: () => languages[locale],
    languages,
    setLocale,
    translate,
    apply
  };
})();
