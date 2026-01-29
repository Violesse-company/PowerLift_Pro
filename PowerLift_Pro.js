// ヘッダー背景変化
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.background = '#1c1c2e';
    header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
  } else {
    header.style.background = '#2a2a3d';
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
  }
});

// スクロールで要素表示
const scrollItems = document.querySelectorAll('.scroll-reveal');

function revealOnScroll() {
  const windowBottom = window.innerHeight + window.scrollY;
  scrollItems.forEach(el => {
    if (windowBottom > el.offsetTop + 50) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ボタンアニメーション
const btn = document.querySelector('.btn-primary');
btn.addEventListener('mousedown', () => {
  btn.style.transform = 'translateY(2px) scale(0.97)';
});
btn.addEventListener('mouseup', () => {
  btn.style.transform = 'translateY(0) scale(1)';
});
