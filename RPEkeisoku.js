const calcBtn = document.getElementById('calcBtn');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

const rpeValue = document.getElementById('rpeValue');
const rpeText = document.getElementById('rpeText');

calcBtn.addEventListener('click', () => {
  const setWeight = Number(document.getElementById('setWeight').value);
  const reps = Number(document.getElementById('reps').value);
  const rm = Number(document.getElementById('rm').value);
  const energy = Number(document.getElementById('energy').value);
  const pain = Number(document.getElementById('pain').value);

  if (!setWeight || !reps || !rm) return;

  // 基本使用率
  let usage = setWeight / rm;

  // 回数補正（1回ごとに+0.015）
  usage += (reps - 1) * 0.015;

  // 元気度補正（低いと少しRPE上昇）
  usage += (100 - energy) * 0.0015;

  // 痛み度補正（0~100%で最大+0.1）
  if (pain >= 60) usage += 0.1;
  else if (pain >= 30) usage += 0.05;

  // RPE計算
  let rpe = usage * 10;
  rpe = Math.round(rpe * 10) / 10; // 小数1桁
  rpe = Math.min(10, Math.max(1, rpe));

  rpeValue.textContent = `RPE ${rpe}`;

// RPE感覚ラベル設定（細かく指定）
if (rpe <= 3.0) {
  rpeText.textContent = '余裕';
  rpeText.style.color = 'lime';
} 
else if (rpe <= 6.9) {
  rpeText.textContent = 'まだ行ける';
  rpeText.style.color = 'lightgreen';
} 
else if (rpe <= 7.9) {
  rpeText.textContent = 'ちょっと疲れた';
  rpeText.style.color = 'yellow';
} 
else if (rpe <= 8.9) {
  rpeText.textContent = 'もうダメ';
  rpeText.style.color = 'orange';
} 
else if (rpe <= 9.9) {
  rpeText.textContent = 'ちょっと限界？';
  rpeText.style.color = 'orangered';
} 
else { // 10.0ピッタリ
  rpeText.textContent = '限界';
  rpeText.style.color = 'red';
}


  overlay.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  // 入力欄リセット
  document.getElementById('setWeight').value = '';
  document.getElementById('reps').value = '';
  document.getElementById('rm').value = '';
  document.getElementById('energy').value = 100;
  document.getElementById('pain').value = 0;
});

// 戻るボタン
backBtn.addEventListener('click', () => {
  window.location.href='index.html';
});

// ダブルタップズーム防止
let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  let now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, {passive:false});

// ピンチズーム禁止
document.addEventListener('gesturestart', e => e.preventDefault());