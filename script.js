const TOTAL = 10;
const list = document.getElementById('message-list');

for (let i = 1; i <= TOTAL; i++) {
  const num = String(i).padStart(2, '0');
  const file = `msg${num}.txt`;

  const block = document.createElement('div');
  block.className = 'message-block';

  const heading = document.createElement('h2');
  heading.textContent = `メッセージ ${i}`;

  const textarea = document.createElement('textarea');
  textarea.id = `textarea-${num}`;
  textarea.readOnly = true;
  textarea.placeholder = '読み込み中...';

  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'コピー';
  btn.addEventListener('click', () => copyText(textarea, btn));

  block.appendChild(heading);
  block.appendChild(textarea);
  block.appendChild(btn);
  list.appendChild(block);

  fetch(file, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`${file} が見つかりません`);
      return res.text();
    })
    .then(text => {
      textarea.value = text;
      // 内容に合わせて高さを自動調整
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    })
    .catch(() => {
      textarea.value = '';
      textarea.placeholder = `（${file} を読み込めませんでした）`;
    });
}

function copyText(textarea, btn) {
  const text = textarea.value;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'コピーしました！';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'コピー';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Clipboard API が使えない場合のフォールバック
    textarea.select();
    document.execCommand('copy');
    btn.textContent = 'コピーしました！';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'コピー';
      btn.classList.remove('copied');
    }, 2000);
  });
}
