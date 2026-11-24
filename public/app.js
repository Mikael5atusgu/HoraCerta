const ROLE_NAMES = {
  aluno: 'Aluno',
  professor: 'Professor',
  gestor: 'Coordenador',
  admin: 'Administrador'
};
const TYPE_NAMES = {
  aula: 'Aula',
  prova: 'Prova',
  trabalho: 'Trabalho',
  feriado: 'Feriado',
  atividade: 'Evento escolar'
};
const FLAG_ICONS = {
  pt: '<svg viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#009b3a"/><path d="M18 2 33 12 18 22 3 12Z" fill="#ffdf00"/><circle cx="18" cy="12" r="6.4" fill="#002776"/><path d="M12 10.6a11 11 0 0 1 12 .2" fill="none" stroke="#fff" stroke-width="1.25"/></svg>',
  es: '<svg viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#aa151b"/><rect y="6" width="36" height="12" fill="#f1bf00"/></svg>',
  en: '<svg viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#b22234"/><path d="M0 1.85h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0zm0 3.69h36v1.85H0z" fill="#fff"/><rect width="15" height="12.9" fill="#3c3b6e"/><g fill="#fff"><circle cx="3" cy="2.5" r=".65"/><circle cx="7.5" cy="2.5" r=".65"/><circle cx="12" cy="2.5" r=".65"/><circle cx="5.25" cy="6.3" r=".65"/><circle cx="9.75" cy="6.3" r=".65"/><circle cx="3" cy="10.1" r=".65"/><circle cx="7.5" cy="10.1" r=".65"/><circle cx="12" cy="10.1" r=".65"/></g></svg>'
};
const ICONS = {
  add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  vacancy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18m0 0 7-7m-7 7-7-7"/><path d="M5 3h14"/></svg>',
  swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3m4 13H5l3 3"/></svg>',
  block: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></svg>',
  feedback: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6a7.5 7.5 0 1 1 17-3.5Z"/><path d="M8 11h8m-8 3h5"/></svg>',
  announcement: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 17-6v14L3 13v-2Z"/><path d="m7 14 2 6h4l-2-5"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1Zm13-12a3 3 0 1 1 0 6m2 2a5 5 0 0 1 3 4v1h-3"/></svg>',
  audit: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};
const state = {
  user: null,
  token: null,
  date: new Date(),
  mode: 'month',
  events: [],
  notices: [],
  enabledCategories: new Set(['aula', 'provas', 'feriado', 'atividade'])
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const dialog = $('#app-dialog');
const i18n = window.HoraCertaI18n;

function currentDateLocale() {
  return i18n.getLanguage().intlLocale;
}

function confirmationWord() {
  return i18n.getLocale() === 'en' ? 'CONFIRM' : 'CONFIRMAR';
}

function dateTimeMarkup(value, style) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  const options = style === 'full-time'
    ? { dateStyle: 'full', timeStyle: 'short' }
    : style === 'medium-time'
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : { timeStyle: 'short' };
  const formatted = new Intl.DateTimeFormat(currentDateLocale(), options).format(date);
  return `<time data-i18n-date="${style}" datetime="${escapeHTML(date.toISOString())}">${escapeHTML(formatted)}</time>`;
}

function refreshDialogDates() {
  $$('[data-i18n-date]').forEach((element) => {
    const date = new Date(element.dateTime);
    if (Number.isNaN(date.getTime())) return;
    const style = element.dataset.i18nDate;
    const options = style === 'full-time'
      ? { dateStyle: 'full', timeStyle: 'short' }
      : style === 'medium-time'
        ? { dateStyle: 'medium', timeStyle: 'short' }
        : { timeStyle: 'short' };
    element.textContent = new Intl.DateTimeFormat(currentDateLocale(), options).format(date);
  });
}

function refreshDialogConfirmation() {
  const form = $('.dialog-form[data-form="delete-event"]');
  if (!form) return;
  const input = form.elements.confirmacao;
  const acceptedValues = ['CONFIRM', 'CONFIRMAR'];
  if (acceptedValues.includes(input.value)) input.value = confirmationWord();
  input.placeholder = confirmationWord();
  const label = $('label[for="field-confirmacao"]', form);
  if (label) label.textContent = 'Digite CONFIRMAR';
  const subtitle = $('.dialog-header p');
  if (subtitle) subtitle.textContent = 'Para continuar, digite CONFIRMAR.';
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  sessionStorage.setItem('horacerta-theme', theme);
  const isLight = theme === 'light';
  const icon = isLight
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
  $$('.theme-button').forEach((button) => {
    button.innerHTML = icon;
    button.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
    button.title = isLight ? 'Tema escuro' : 'Tema claro';
  });
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' is-error' : ''}`;
  toast.textContent = message;
  $('#toast-region').append(toast);
  window.setTimeout(() => toast.remove(), 3800);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(path, { ...options, headers });
  let result;
  try {
    result = await response.json();
  } catch {
    result = {};
  }
  if (response.status === 401 && state.token) {
    logout();
    throw new Error('Sua sessão expirou. Entre novamente.');
  }
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a operação.');
  return result;
}

function formatRole(role) {
  return ROLE_NAMES[role] || role;
}

function showLogin() {
  $('#login-screen').hidden = false;
  $('#app-screen').hidden = true;
}

function showApp() {
  $('#login-screen').hidden = true;
  $('#app-screen').hidden = false;
  $('#role-badge').textContent = formatRole(state.user.papel);
  $('#user-name').textContent = state.user.nome;
  $('#user-email').textContent = state.user.email;
  $('#avatar').textContent = state.user.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  renderQuickActions();
  loadCalendar().catch((error) => showToast(error.message, true));
}

function logout() {
  sessionStorage.removeItem('horacerta-session');
  state.user = null;
  state.token = null;
  showLogin();
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = $('#login-error');
  errorBox.hidden = true;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Entrando...';
  try {
    const result = await api('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value,
        senha: form.senha.value,
        papel: form.papel.value
      })
    });
    state.token = result.token;
    state.user = result.user;
    sessionStorage.setItem('horacerta-session', JSON.stringify({ token: result.token, user: result.user }));
    form.reset();
    showApp();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = 'Entrar no sistema';
  }
}

function closeLanguageMenus(returnFocus = false) {
  const activeToggle = returnFocus ? $('.language-toggle[aria-expanded="true"]') : null;
  $$('.language-control').forEach((control) => {
    const toggle = $('.language-toggle', control);
    $('.language-menu', control).hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
  if (activeToggle) activeToggle.focus();
}

function updateLanguageControls() {
  const currentLanguage = i18n.getLocale();
  const language = i18n.getLanguage();
  $$('.language-control').forEach((control) => {
    $('.language-current-flag', control).innerHTML = FLAG_ICONS[currentLanguage];
    const toggle = $('.language-toggle', control);
    toggle.setAttribute('aria-label', i18n.translate(`Idioma: ${language.name.toLowerCase()}`));
    $$('[data-language]', control).forEach((button) => {
      const isCurrentLanguage = button.dataset.language === currentLanguage;
      button.hidden = isCurrentLanguage;
      $('[data-language-flag]', button).innerHTML = FLAG_ICONS[button.dataset.language];
    });
  });
}

function setLanguage(language) {
  i18n.setLocale(language);
  closeLanguageMenus(true);
  updateLanguageControls();
  if (!state.user) return;
  $('#role-badge').textContent = formatRole(state.user.papel);
  renderQuickActions();
  renderCalendar();
  renderNotices();
  refreshDialogDates();
  refreshDialogConfirmation();
  i18n.apply();
}

function renderQuickActions() {
  const actionsByRole = {
    aluno: [
      { label: 'Reportar problema / sugestão', icon: 'feedback', action: 'feedback', className: 'action-danger' }
    ],
    professor: [
      { label: 'Novo evento / prova', icon: 'add', action: 'new-event' },
      { label: 'Pegar aula vaga', icon: 'vacancy', action: 'vacancy' },
      { label: 'Reportar problema', icon: 'feedback', action: 'feedback', className: 'action-danger' }
    ],
    gestor: [
      { label: 'Novo evento / prova', icon: 'add', action: 'new-event' },
      { label: 'Aprovar trocas', icon: 'swap', action: 'swaps', className: 'action-warning' },
      { label: 'Bloquear horário', icon: 'block', action: 'block', className: 'action-warning' },
      { label: 'Emitir aviso geral', icon: 'announcement', action: 'announcement', className: 'action-danger' }
    ],
    admin: [
      { label: 'Novo evento / prova', icon: 'add', action: 'new-event' },
      { label: 'Aprovar trocas', icon: 'swap', action: 'swaps', className: 'action-warning' },
      { label: 'Bloquear horário', icon: 'block', action: 'block', className: 'action-warning' },
      { label: 'Gerenciar usuários', icon: 'users', action: 'users' },
      { label: 'Ver feedbacks', icon: 'feedback', action: 'feedback-list' },
      { label: 'Trilha de auditoria', icon: 'audit', action: 'audit' },
      { label: 'Emitir aviso geral', icon: 'announcement', action: 'announcement', className: 'action-danger' }
    ]
  };
  $('#quick-actions').innerHTML = (actionsByRole[state.user.papel] || []).map((action) => `
    <button class="quick-action ${action.className || ''}" type="button" data-action="${action.action}">
      <span class="action-icon" aria-hidden="true">${ICONS[action.icon]}</span>${escapeHTML(i18n.translate(action.label))}
    </button>`).join('');
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function mondayOf(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(currentDateLocale(), { hour: '2-digit', minute: '2-digit' }).format(date);
}

function getVisibleEvents(day) {
  return state.events.filter((event) => {
    const type = event.tipo === 'prova' || event.tipo === 'trabalho' ? 'provas' : event.tipo;
    return dateKey(new Date(event.data_inicio)) === dateKey(day) && state.enabledCategories.has(type);
  });
}

function renderCalendar() {
  const title = $('#calendar-title');
  const subtitle = $('#calendar-subtitle');
  const grid = $('#calendar-grid');
  const monthName = new Intl.DateTimeFormat(currentDateLocale(), { month: 'long', year: 'numeric' }).format(state.date);
  title.textContent = state.mode === 'week'
    ? new Intl.DateTimeFormat(currentDateLocale(), { month: 'long', year: 'numeric' }).format(mondayOf(state.date))
    : monthName;
  title.textContent = title.textContent.charAt(0).toLocaleUpperCase(currentDateLocale()) + title.textContent.slice(1);
  const weekdayNames = Array.from({ length: 7 }, (_, index) => (
    new Intl.DateTimeFormat(currentDateLocale(), { weekday: 'short' }).format(new Date(2024, 0, index + 1))
  ));
  const days = [];
  if (state.mode === 'week') {
    const start = mondayOf(state.date);
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    subtitle.textContent = `${days[0].getDate()} – ${days[6].getDate()}`;
    grid.classList.add('week-view');
  } else {
    grid.classList.remove('week-view');
    const first = new Date(state.date.getFullYear(), state.date.getMonth(), 1);
    first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    for (let i = 0; i < 42; i += 1) {
      const day = new Date(first);
      day.setDate(first.getDate() + i);
      days.push(day);
    }
    subtitle.textContent = new Intl.DateTimeFormat(currentDateLocale(), { month: 'long' }).format(state.date);
  }

  const header = weekdayNames.map((day) => `<div class="weekday">${day}</div>`).join('');
  const todayKey = dateKey(new Date());
  const cells = days.map((day) => {
    const isOutside = state.mode === 'month' && day.getMonth() !== state.date.getMonth();
    const classes = ['day-cell', isOutside ? 'is-outside' : '', dateKey(day) === todayKey ? 'is-today' : ''].filter(Boolean).join(' ');
    const events = getVisibleEvents(day).map((event) => {
      const time = formatTime(event.data_inicio);
      const className = `type-${event.tipo}${event.vaga ? ' is-vacant' : ''}`;
      const label = `${time ? `${time} ` : ''}${event.vaga ? `${i18n.translate('Aula vaga')} · ` : ''}${i18n.translate(event.titulo)}`;
      return `<button type="button" class="calendar-event ${className}" data-event-id="${escapeHTML(event.id)}" aria-label="${escapeHTML(label)}" title="${escapeHTML(label)}"><span class="calendar-event-text">${escapeHTML(label)}</span><span class="calendar-event-marker" aria-hidden="true"></span></button>`;
    }).join('');
    return `<section class="${classes}" aria-label="${escapeHTML(new Intl.DateTimeFormat(currentDateLocale(), { dateStyle: 'full' }).format(day))}">
      <span class="day-number">${day.getDate()}</span>${events}</section>`;
  }).join('');
  grid.innerHTML = header + cells;
}

async function loadCalendar() {
  let query;
  if (state.mode === 'week') {
    const start = mondayOf(state.date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    query = `inicio=${encodeURIComponent(start.toISOString())}&fim=${encodeURIComponent(end.toISOString())}`;
  } else {
    const month = state.date.getMonth() + 1;
    const year = state.date.getFullYear();
    query = `mes=${month}&ano=${year}`;
  }
  const result = await api(`/api/v1/eventos?${query}`);
  state.events = result.data;
  state.notices = result.avisos;
  renderCalendar();
  renderNotices();
}

function renderNotices() {
  const container = $('#notice-list');
  container.innerHTML = state.notices.length
    ? state.notices.slice(0, 3).map((notice) => `<article class="notice-card">
      <strong data-user-content>${escapeHTML(i18n.translate(notice.titulo))}</strong><p data-user-content>${escapeHTML(i18n.translate(notice.mensagem))}</p></article>`).join('')
    : `<p class="notice-empty">${i18n.translate('Nenhum aviso publicado.')}</p>`;
  const banner = $('#announcement-banner');
  const latest = state.notices[0];
  if (!latest || sessionStorage.getItem(`horacerta-dismissed-${latest.id}`)) {
    banner.hidden = true;
    return;
  }
  $('#announcement-title').textContent = i18n.translate(latest.titulo);
  $('#announcement-message').textContent = i18n.translate(latest.mensagem);
  banner.dataset.noticeId = latest.id;
  banner.hidden = false;
}

function showDialog(title, subtitle, content) {
  $('#dialog-content').innerHTML = `
    <div class="dialog-header">
      <div><h2 id="dialog-title">${escapeHTML(title)}</h2>${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ''}</div>
      <button class="icon-button dialog-close" type="button" aria-label="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="dialog-body">${content}</div>`;
  if (!dialog.open) dialog.showModal();
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

function inputField(label, name, options = {}) {
  const type = options.type || 'text';
  const required = options.required === false ? '' : 'required';
  const value = options.value ? `value="${escapeHTML(options.value)}"` : '';
  const placeholder = options.placeholder ? `placeholder="${escapeHTML(options.placeholder)}"` : '';
  if (options.select) {
    const choices = options.select.map(([optionValue, text]) => `
      <option value="${escapeHTML(optionValue)}" ${options.value === optionValue ? 'selected' : ''}>${escapeHTML(text)}</option>`).join('');
    return `<div class="form-field"><label for="field-${name}">${escapeHTML(label)}</label><select id="field-${name}" name="${name}" ${required}>${choices}</select></div>`;
  }
  if (options.textarea) {
    return `<div class="form-field"><label for="field-${name}">${escapeHTML(label)}</label><textarea id="field-${name}" name="${name}" data-user-text maxlength="${options.maxLength || 1000}" ${required} ${placeholder}>${escapeHTML(options.value || '')}</textarea></div>`;
  }
  return `<div class="form-field"><label for="field-${name}">${escapeHTML(label)}</label><input id="field-${name}" name="${name}" type="${type}" ${value} ${required} ${placeholder} ${options.min ? `min="${options.min}"` : ''}></div>`;
}

function localDateTime(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function openEventForm(isBlock = false, existing = null) {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const end = new Date(now.getTime() + 60 * 60 * 1000);
  const startValue = existing ? localDateTime(new Date(existing.data_inicio)) : localDateTime(now);
  const endValue = existing ? localDateTime(new Date(existing.data_fim)) : localDateTime(end);
  const title = isBlock ? 'Bloquear horário' : existing ? 'Editar evento' : 'Novo evento';
  const fields = `
    ${inputField('Título', 'titulo', { value: existing?.titulo, placeholder: isBlock ? 'Ex.: Evento na quadra' : 'Ex.: Prova de Matemática' })}
    <div class="form-row">
      ${inputField('Categoria', 'tipo', {
        select: [
          ['aula', 'Aula'], ['prova', 'Prova'], ['trabalho', 'Trabalho'],
          ['feriado', 'Feriado'], ['atividade', 'Evento escolar']
        ],
        value: existing?.tipo || (isBlock ? 'atividade' : 'prova')
      })}
      ${inputField('Turma', 'turma', { value: existing?.turma || state.user.turma || '2º Ano A', required: false })}
    </div>
    <div class="form-row">
      ${inputField('Início', 'inicio', { type: 'datetime-local', value: startValue })}
      ${inputField('Fim', 'fim', { type: 'datetime-local', value: endValue })}
    </div>
    ${inputField('Disciplina / local', 'disciplina', { value: existing?.disciplina, placeholder: isBlock ? 'Ex.: Quadra' : 'Ex.: Matemática', required: false })}
    ${inputField('Descrição', 'descricao', { textarea: true, required: false, maxLength: 1000, value: existing?.descricao })}`;
  showDialog(title, isBlock ? 'O horário bloqueado ficará visível no calendário.' : 'Os eventos publicados aparecem imediatamente para a escola.', `
    <form class="dialog-form" data-form="event" ${existing ? `data-event-id="${escapeHTML(existing.id)}"` : ''}>
      ${fields}
      <p class="form-error dialog-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button><button class="button button-primary" type="submit">${existing ? 'Salvar alterações' : 'Salvar evento'}</button></div>
    </form>`);
}

function openFeedbackForm() {
  showDialog('Enviar feedback', 'Sua mensagem será encaminhada à administração da escola.', `
    <form class="dialog-form" data-form="feedback">
      ${inputField('Tipo de relato', 'tipo', { select: [['problema', 'Problema no horário'], ['sugestao', 'Sugestão']], value: 'problema' })}
      ${inputField('Mensagem', 'mensagem', { textarea: true, placeholder: 'Conte o que aconteceu ou compartilhe sua sugestão.', maxLength: 1000 })}
      <p class="form-error dialog-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button><button class="button button-primary" type="submit">Enviar feedback</button></div>
    </form>`);
}

function openAnnouncementForm() {
  showDialog('Emitir aviso geral', 'O aviso ficará visível para todos os perfis.', `
    <form class="dialog-form" data-form="announcement">
      ${inputField('Título', 'titulo', { placeholder: 'Ex.: Alteração de horário' })}
      ${inputField('Mensagem', 'mensagem', { textarea: true, placeholder: 'Escreva o aviso para a comunidade escolar.', maxLength: 1000 })}
      <p class="form-error dialog-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button><button class="button button-primary" type="submit">Publicar aviso</button></div>
    </form>`);
}

function openUserForm() {
  showDialog('Cadastrar usuário', 'O acesso será vinculado ao perfil escolhido.', `
    <form class="dialog-form" data-form="user">
      ${inputField('Nome', 'nome', { placeholder: 'Nome completo' })}
      ${inputField('E-mail', 'email', { type: 'email', placeholder: 'nome@escola.edu.br' })}
      ${inputField('Senha temporária', 'senha', { type: 'password', placeholder: 'Mínimo de 10 caracteres' })}
      <div class="form-row">
        ${inputField('Perfil', 'papel', { select: Object.entries(ROLE_NAMES), value: 'aluno' })}
          ${inputField('Turma (aluno/professor)', 'turma', { placeholder: 'Ex.: 2º Ano A', required: false })}
      </div>
      <p class="form-error dialog-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button><button class="button button-primary" type="submit">Cadastrar</button></div>
    </form>`);
}

async function openVacancies() {
  const vacancies = state.events.filter((event) => event.vaga);
  const content = vacancies.length ? `<div class="dialog-list">${vacancies.map((event) => `
    <article class="list-card"><div class="list-card-content"><strong data-user-content>${escapeHTML(event.titulo)}</strong>
      <p>${event.turma ? `<span data-user-content>${escapeHTML(event.turma)}</span>` : '<span>Turma não informada</span>'} · ${dateTimeMarkup(event.data_inicio, 'medium-time')}</p>
    </div><button class="button button-primary" type="button" data-request-event="${escapeHTML(event.id)}">Solicitar</button></article>`).join('')}</div>`
    : '<p class="empty-state">Não há aulas vagas disponíveis neste período.</p>';
  showDialog('Aulas vagas', 'Envie uma solicitação para análise da coordenação.', content);
}

async function openSwaps() {
  showDialog('Solicitações pendentes', 'Revise e decida sobre as substituições de aula.', '<p class="empty-state">Carregando solicitações...</p>');
  try {
    const { data } = await api('/api/v1/trocas');
    const content = data.length ? `<div class="dialog-list">${data.map((request) => `
      <article class="list-card"><div class="list-card-content"><strong data-user-content>${escapeHTML(request.titulo)}</strong>
        <p><span data-user-content>${escapeHTML(request.professor)}</span> · ${request.disciplina ? `<span data-user-content>${escapeHTML(request.disciplina)}</span>` : '<span>Aula</span>'} · <span data-user-content>${escapeHTML(request.turma || '')}</span><br>
        ${dateTimeMarkup(request.data_inicio, 'medium-time')}</p>
      </div><div class="list-card-actions">
        <button class="button button-primary" type="button" data-decision="aprovado" data-request-id="${escapeHTML(request.id)}">Aprovar</button>
        <button class="button button-danger" type="button" data-decision="recusado" data-request-id="${escapeHTML(request.id)}">Recusar</button>
      </div></article>`).join('')}</div>`
      : '<p class="empty-state">Não há solicitações aguardando análise.</p>';
    showDialog('Solicitações pendentes', 'Revise e decida sobre as substituições de aula.', content);
  } catch (error) {
    showToast(error.message, true);
    closeDialog();
  }
}

async function openUsers() {
  showDialog('Gerenciar usuários', 'Cadastre contas e defina os perfis de acesso.', `
    <div class="dialog-actions list-toolbar"><button class="button button-primary" type="button" data-action="user-form">+ Novo usuário</button></div>
    <p class="empty-state">Carregando usuários...</p>`);
  try {
    const { data } = await api('/api/v1/admin/usuarios');
    const content = data.length ? `<div class="table-wrap" role="region" aria-label="Usuários cadastrados" tabindex="0">
      <table class="data-table">
        <caption class="sr-only">Usuários cadastrados no HoraCerta</caption>
        <thead><tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Perfil</th><th scope="col">Turma</th></tr></thead>
        <tbody>${data.map((user) => `<tr>
          <td data-user-content>${escapeHTML(user.nome)}</td>
          <td data-user-content>${escapeHTML(user.email)}</td>
          <td><span class="table-role">${escapeHTML(formatRole(user.papel))}</span></td>
          <td data-user-content>${escapeHTML(user.turma || '—')}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`
      : '<p class="empty-state">Nenhum usuário cadastrado.</p>';
    showDialog('Gerenciar usuários', 'Cadastre contas e defina os perfis de acesso.', `
      <div class="dialog-actions list-toolbar"><button class="button button-primary" type="button" data-action="user-form">+ Novo usuário</button></div>${content}`);
  } catch (error) {
    showToast(error.message, true);
    closeDialog();
  }
}

async function openFeedbackList() {
  showDialog('Feedbacks dos alunos', '', '<p class="empty-state">Carregando feedbacks...</p>');
  try {
    const { data } = await api('/api/v1/feedbacks');
    const content = data.length ? `<div class="dialog-list">${data.map((item) => `
      <article class="list-card"><div class="list-card-content"><strong><span>${item.tipo === 'problema' ? 'Problema' : 'Sugestão'}</span> · ${item.aluno ? `<span data-user-content>${escapeHTML(item.aluno)}</span>` : '<span>Aluno</span>'}</strong>
        <p data-user-content>${escapeHTML(item.mensagem)}</p></div></article>`).join('')}</div>`
      : '<p class="empty-state">Nenhum feedback recebido.</p>';
    showDialog('Feedbacks dos alunos', '', content);
  } catch (error) {
    showToast(error.message, true);
    closeDialog();
  }
}

async function openAudit() {
  showDialog('Trilha de auditoria', 'Últimas ações administrativas registradas.', '<p class="empty-state">Carregando registros...</p>');
  try {
    const { data } = await api('/api/v1/admin/auditoria');
    const content = data.length ? `<div class="dialog-list">${data.map((item) => `
      <article class="list-card"><div class="list-card-content"><strong>${item.usuario ? `<span data-user-content>${escapeHTML(item.acao)} · ${escapeHTML(item.usuario)}</span>` : `<span data-user-content>${escapeHTML(item.acao)}</span> · <span>Sistema</span>`}</strong>
        <p data-user-content>${escapeHTML(item.detalhes || '')} · ${escapeHTML(item.data_hora)}</p></div></article>`).join('')}</div>`
      : '<p class="empty-state">Nenhuma ação registrada.</p>';
    showDialog('Trilha de auditoria', 'Últimas ações administrativas registradas.', content);
  } catch (error) {
    showToast(error.message, true);
    closeDialog();
  }
}

function openEventDetails(event) {
  const canDelete = ['gestor', 'admin'].includes(state.user.papel);
  const content = `
    <div class="dialog-list">
      <article class="list-card"><div class="list-card-content"><strong><span>${escapeHTML(TYPE_NAMES[event.tipo] || event.tipo)}</span>${event.vaga ? ' · <span>Aula vaga</span>' : ''}</strong>
        <p>${dateTimeMarkup(event.data_inicio, 'full-time')} – ${dateTimeMarkup(event.data_fim, 'time')}<br>${event.disciplina
    ? `<span data-user-content>${escapeHTML(event.disciplina)}</span>`
    : '<span>Sem disciplina</span>'} · ${event.turma
    ? `<span data-user-content>${escapeHTML(event.turma)}</span>`
    : '<span>Todas as turmas</span>'}<br>
        <span data-user-content>${escapeHTML(event.descricao || '')}</span></p></div></article>
    </div>
    <div class="dialog-actions">
      ${canDelete ? `<button class="button button-danger" type="button" data-delete-event="${escapeHTML(event.id)}">Excluir evento</button>` : ''}
      ${['professor', 'gestor', 'admin'].includes(state.user.papel)
        && (state.user.papel !== 'professor' || event.criado_por === state.user.id)
        ? `<button class="button" type="button" data-edit-event="${escapeHTML(event.id)}">Editar evento</button>` : ''}
      <button class="button dialog-close" type="button">Fechar</button>
    </div>`;
  showDialog(event.titulo, 'Detalhes do evento', content);
}

function confirmDelete(event) {
  showDialog('Excluir evento?', `Confirme a remoção de “${event.titulo}”.`, `
    <p>Esta ação removerá o evento do calendário e não poderá ser desfeita.</p>
    <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button>
    <button class="button button-danger" type="button" data-confirm-delete="${escapeHTML(event.id)}">Continuar</button></div>`);
}

function finalDeleteConfirmation(event) {
  showDialog('Confirmação final', 'Para continuar, digite CONFIRMAR.', `
    <form class="dialog-form" data-form="delete-event" data-event-id="${escapeHTML(event.id)}">
      ${inputField('Digite CONFIRMAR', 'confirmacao', { placeholder: confirmationWord() })}
      <p class="form-error dialog-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button dialog-cancel" type="button">Cancelar</button>
      <button class="button button-danger" type="submit">Excluir definitivamente</button></div>
    </form>`);
}

function getFormValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function submitDialogForm(form) {
  const errorBox = $('.dialog-error', form);
  errorBox.hidden = true;
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  try {
    const values = getFormValues(form);
    if (form.dataset.form === 'event') {
      const eventId = form.dataset.eventId;
      await api(eventId ? `/api/v1/eventos/${encodeURIComponent(eventId)}` : '/api/v1/eventos', {
        method: eventId ? 'PUT' : 'POST',
        body: JSON.stringify({
          titulo: values.titulo,
          tipo: values.tipo,
          data_inicio: new Date(values.inicio).toISOString(),
          data_fim: new Date(values.fim).toISOString(),
          disciplina: values.disciplina,
          turma: values.turma,
          descricao: values.descricao
        })
      });
      showToast(eventId ? 'Alterações salvas.' : 'Evento publicado no calendário.');
    } else if (form.dataset.form === 'feedback') {
      await api('/api/v1/feedbacks', { method: 'POST', body: JSON.stringify(values) });
      showToast('Feedback enviado. Obrigado!');
    } else if (form.dataset.form === 'announcement') {
      await api('/api/v1/avisos', { method: 'POST', body: JSON.stringify(values) });
      showToast('Aviso publicado para a escola.');
    } else if (form.dataset.form === 'user') {
      await api('/api/v1/admin/usuarios', { method: 'POST', body: JSON.stringify(values) });
      showToast('Usuário cadastrado com sucesso.');
      await openUsers();
      return;
    } else if (form.dataset.form === 'delete-event') {
      if (values.confirmacao !== confirmationWord()) {
        const message = confirmationWord() === 'CONFIRM' ? 'Digite CONFIRM para remover o evento.' : 'Digite CONFIRMAR para remover o evento.';
        throw new Error(i18n.translate(message));
      }
      await api(`/api/v1/eventos/${encodeURIComponent(form.dataset.eventId)}`, { method: 'DELETE' });
      showToast('Evento removido e ação registrada na auditoria.');
    }
    closeDialog();
    await loadCalendar();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
  } finally {
    if (submit.isConnected) submit.disabled = false;
  }
}

async function handleDialogClick(event) {
  const closeButton = event.target.closest('.dialog-close, .dialog-cancel');
  if (closeButton) {
    closeDialog();
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton && actionButton.dataset.action === 'user-form') {
    openUserForm();
    return;
  }
  const requestButton = event.target.closest('[data-request-event]');
  if (requestButton) {
    requestButton.disabled = true;
    try {
      await api('/api/v1/trocas', {
        method: 'POST',
        body: JSON.stringify({ evento_id: requestButton.dataset.requestEvent })
      });
      closeDialog();
      showToast('Solicitação enviada com sucesso!');
    } catch (error) {
      showToast(error.message, true);
      requestButton.disabled = false;
    }
    return;
  }
  const decisionButton = event.target.closest('[data-decision]');
  if (decisionButton) {
    decisionButton.disabled = true;
    try {
      const id = encodeURIComponent(decisionButton.dataset.requestId);
      await api(`/api/v1/trocas/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ decisao: decisionButton.dataset.decision })
      });
      showToast(decisionButton.dataset.decision === 'aprovado' ? 'Solicitação aprovada.' : 'Solicitação recusada.');
      await openSwaps();
      await loadCalendar();
    } catch (error) {
      showToast(error.message, true);
      decisionButton.disabled = false;
    }
    return;
  }
  const deleteButton = event.target.closest('[data-delete-event]');
  if (deleteButton) {
    const item = state.events.find((entry) => entry.id === deleteButton.dataset.deleteEvent);
    if (item) confirmDelete(item);
    return;
  }
  const editButton = event.target.closest('[data-edit-event]');
  if (editButton) {
    const item = state.events.find((entry) => entry.id === editButton.dataset.editEvent);
    if (item) openEventForm(false, item);
    return;
  }
  const continueButton = event.target.closest('[data-confirm-delete]');
  if (continueButton) {
    const item = state.events.find((entry) => entry.id === continueButton.dataset.confirmDelete);
    if (item) finalDeleteConfirmation(item);
  }
}

function navigatePeriod(direction) {
  if (state.mode === 'month') {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth() + direction, 1);
  } else {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth(), state.date.getDate() + direction * 7);
  }
  loadCalendar().catch((error) => showToast(error.message, true));
}

function handleQuickAction(action) {
  switch (action) {
    case 'new-event': openEventForm(); break;
    case 'block': openEventForm(true); break;
    case 'feedback': openFeedbackForm(); break;
    case 'announcement': openAnnouncementForm(); break;
    case 'vacancy': openVacancies(); break;
    case 'swaps': openSwaps(); break;
    case 'users': openUsers(); break;
    case 'feedback-list': openFeedbackList(); break;
    case 'audit': openAudit(); break;
    default: break;
  }
}

function initialize() {
  setTheme(sessionStorage.getItem('horacerta-theme') || 'dark');
  updateLanguageControls();
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.language-toggle');
    if (toggle) {
      const menu = $('.language-menu', toggle.parentElement);
      const shouldOpen = menu.hidden;
      closeLanguageMenus();
      menu.hidden = !shouldOpen;
      toggle.setAttribute('aria-expanded', String(shouldOpen));
      return;
    }

    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      setLanguage(languageButton.dataset.language);
      return;
    }

    if (!event.target.closest('.language-control')) closeLanguageMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('.language-toggle[aria-expanded="true"]')) {
      closeLanguageMenus(true);
    }
  });
  $$('.language-control').forEach((control) => control.addEventListener('focusout', (event) => {
    if (!control.contains(event.relatedTarget)) closeLanguageMenus();
  }));
  $('#login-form').addEventListener('submit', handleLogin);
  $('#toggle-password').addEventListener('click', () => {
    const password = $('#login-password');
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    $('#toggle-password').textContent = showing ? 'Mostrar' : 'Ocultar';
    $('#toggle-password').setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
  });
  $$('.demo-user').forEach((button) => button.addEventListener('click', () => {
    $('#login-email').value = button.dataset.email;
    $('#login-role').value = button.dataset.role;
    $('#login-password').focus();
    $('#login-error').hidden = true;
  }));
  $$('.theme-button').forEach((button) => button.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }));
  $('#logout-button').addEventListener('click', logout);
  $('#quick-actions').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (button) handleQuickAction(button.dataset.action);
  });
  $('#calendar-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-event-id]');
    if (!button) return;
    const item = state.events.find((entry) => entry.id === button.dataset.eventId);
    if (!item) return;
    if (item.vaga && state.user.papel === 'professor') openVacancies();
    else openEventDetails(item);
  });
  $('#calendar-grid').addEventListener('dblclick', (event) => {
    const button = event.target.closest('[data-event-id]');
    if (!button) return;
    const item = state.events.find((entry) => entry.id === button.dataset.eventId);
    if (item) openEventDetails(item);
  });
  $('#app-dialog').addEventListener('click', handleDialogClick);
  $('#app-dialog').addEventListener('submit', (event) => {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    submitDialogForm(form);
  });
  $('#app-dialog').addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  $('#previous-period').addEventListener('click', () => navigatePeriod(-1));
  $('#next-period').addEventListener('click', () => navigatePeriod(1));
  $('#today-button').addEventListener('click', () => {
    state.date = new Date();
    loadCalendar().catch((error) => showToast(error.message, true));
  });
  $('#month-view').addEventListener('click', () => {
    state.mode = 'month';
    $('#month-view').classList.add('is-active');
    $('#week-view').classList.remove('is-active');
    $('#month-view').setAttribute('aria-pressed', 'true');
    $('#week-view').setAttribute('aria-pressed', 'false');
    loadCalendar().catch((error) => showToast(error.message, true));
  });
  $('#week-view').addEventListener('click', () => {
    state.mode = 'week';
    $('#week-view').classList.add('is-active');
    $('#month-view').classList.remove('is-active');
    $('#week-view').setAttribute('aria-pressed', 'true');
    $('#month-view').setAttribute('aria-pressed', 'false');
    loadCalendar().catch((error) => showToast(error.message, true));
  });
  $$('.category-option input').forEach((checkbox) => checkbox.addEventListener('change', () => {
    if (checkbox.checked) state.enabledCategories.add(checkbox.value);
    else state.enabledCategories.delete(checkbox.value);
    renderCalendar();
  }));
  $('#dismiss-announcement').addEventListener('click', () => {
    const id = $('#announcement-banner').dataset.noticeId;
    if (id) sessionStorage.setItem(`horacerta-dismissed-${id}`, 'true');
    $('#announcement-banner').hidden = true;
  });

  try {
    const session = JSON.parse(sessionStorage.getItem('horacerta-session') || 'null');
    if (session?.token && session?.user) {
      state.token = session.token;
      state.user = session.user;
      showApp();
    }
  } catch {
    sessionStorage.removeItem('horacerta-session');
  }
}

document.addEventListener('DOMContentLoaded', initialize);
