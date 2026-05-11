function createModal(title, content, buttons = []) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';

  const buttonsHtml = buttons.map(btn => {
    const btnClass = btn.primary ? 'btn-primary' : 'btn-secondary';
    return `<button class="flex-1 ${btnClass}" onclick="${btn.onClick}">${btn.text}</button>`;
  }).join('');

  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
      <h2 class="text-2xl font-bold mb-4">${title}</h2>
      <div class="mb-6">${content}</div>
      <div class="flex gap-2">
        ${buttonsHtml}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function closeModal(modalElement) {
  if (modalElement) {
    modalElement.remove();
  }
}

function showConfirmDialog(title, message, onConfirm, onCancel = null) {
  const buttons = [
    { text: 'キャンセル', onClick: `closeModal(document.querySelector('.fixed'))`, primary: false },
    { text: 'OK', onClick: onConfirm, primary: true }
  ];

  createModal(title, `<p>${message}</p>`, buttons);
}
