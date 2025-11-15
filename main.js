const form = document.querySelector('#post-form');
const titulo = document.querySelector('#post-title');
const conteudo = document.querySelector('#post-content');
const tituloRenderizar = document.querySelector('#rendered-title');
const conteudoRenderizar = document.querySelector('#rendered-content');
const idRenderizar = document.querySelector('#rendered-id');
const feedback = document.querySelector('#feedback');
const submitButton = form.querySelector('button[type="submit"]');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const setFeedback = (message = '', state = '') => {
  feedback.textContent = message;
  feedback.classList.remove('feedback--error', 'feedback--success');

  if (state === 'error') {
    feedback.classList.add('feedback--error');
  }

  if (state === 'success') {
    feedback.classList.add('feedback--success');
  }
};

const renderPost = ({ title, body, id }) => {
  tituloRenderizar.textContent = title;
  conteudoRenderizar.textContent = body;
  idRenderizar.textContent = id ? `ID retornado pela API: ${id}` : '';
};

const toggleLoading = (isLoading) => {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Publicando…' : 'Publicar agora';
};

const resetPreviewIfNeeded = () => {
  if (!titulo.value.trim() && !conteudo.value.trim()) {
    renderPost({
      title: 'Seu título aparecerá aqui',
      body: 'O conteúdo retornado pela API será exibido neste espaço. Faça um post para começar.',
      id: ''
    });
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const titleValue = titulo.value.trim();
  const contentValue = conteudo.value.trim();

  if (titleValue.length < 3 || contentValue.length < 10) {
    setFeedback('Preencha um título e conteúdo com pelo menos 10 caracteres.', 'error');
    titulo.focus();
    return;
  }

  const data = {
    title: titulo.value,
    body: conteudo.value,
    userId: 1
  };

  try {
    setFeedback('Enviando post para a API…');
    toggleLoading(true);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    if (!response.ok) {
      throw new Error('Não foi possível publicar o post agora.');
    }

    const json = await response.json();

    renderPost(json);
    setFeedback('Post publicado com sucesso!', 'success');
    form.reset();
    titulo.focus();
  } catch (error) {
    console.error(error);
    setFeedback('Algo deu errado ao publicar. Tente novamente em instantes.', 'error');
  } finally {
    toggleLoading(false);
    resetPreviewIfNeeded();
  }
});
