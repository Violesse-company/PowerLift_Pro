/* ===== 管理者用JSON ===== */
const userData = {
  922: {
    height: 166,
    bodyWeight: 76,
    max: 0,
    setWeight: 150,
    reps: 5,
    energy: 100,
    pain: 0,
    sleep: 8,
    meals: { morning: 0, noon: 1, evening: 0, midnight: 1 },
    mealAmount: 2,
    focus: 2
  },
  120: {
    height: 150,
    bodyWeight: 50,
    max: 0,
    setWeight: 80,
    reps: 5,
    energy: 100,
    pain: 0,
    sleep: 7,
    meals: { morning: 0, noon: 1, evening: 1, midnight: 0 },
    mealAmount: 2,
    focus: 2
  },
    220: {
    height: 160,
    bodyWeight: 67,
    max: 0,
    setWeight: 140,
    reps: 5,
    energy: 100,
    pain: 0,
    sleep: 6,
    meals: { morning: 0, noon: 1, evening: 1, midnight: 0 },
    mealAmount: 2,
    focus: 3
  },
  
};

/* ===== 要素取得 ===== */
const userIdInput = document.getElementById('userIdInput');
const loadUserBtn = document.getElementById('loadUserBtn');

const heightInput = document.getElementById('heightInput');
const bodyWeightInput = document.getElementById('bodyWeightInput');
const maxInput = document.getElementById('maxInput');
const setWeightInput = document.getElementById('setWeightInput');
const repsInput = document.getElementById('repsInput');
const energyInput = document.getElementById('energyInput');
const painInput = document.getElementById('painInput');
const sleepInput = document.getElementById('sleepInput');

const mealMorning = document.getElementById('mealMorning');
const mealNoon = document.getElementById('mealNoon');
const mealEvening = document.getElementById('mealEvening');
const mealMidnight = document.getElementById('mealMidnight');
const mealAmount = document.getElementById('mealAmount');
const focusInput = document.getElementById('focusInput');

const calcBtn = document.getElementById('calcBtn');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

const estimatedRM = document.getElementById('estimatedRM');
const safeWeight = document.getElementById('safeWeight');
const challengeWeight = document.getElementById('challengeWeight');
const todayMax = document.getElementById('todayMax');
const rpe = document.getElementById('rpe');
const rpeLabel = document.getElementById('rpeLabel');

const ROUND = 2.5;

/* ===== 補助関数（改造前と同一） ===== */
function roundWeight(val) {
  return Math.round(val / ROUND) * ROUND;
}

function painCorrection(pain) {
  if (pain <= 30) return 1.0;
  if (pain <= 60) return 0.95;
  return 0.9;
}

function mealFactor(value) {
  if (!value) return 1;
  return Number(value);
}

function focusFactor(value) {
  if (!value) return 1;
  return Number(value);
}

/* ===== 保存者番号 → 全自動入力 ===== */
loadUserBtn.addEventListener('click', () => {
  const data = userData[userIdInput.value];
  if (!data) {
    alert('該当する番号がありません');
    return;
  }

  heightInput.value = data.height ?? '';
  bodyWeightInput.value = data.bodyWeight ?? '';
  maxInput.value = data.max ?? '';
  setWeightInput.value = data.setWeight ?? '';
  repsInput.value = data.reps ?? '';
  energyInput.value = data.energy ?? 100;
  painInput.value = data.pain ?? 0;
  sleepInput.value = data.sleep ?? '';

  mealMorning.value = data.meals?.morning ?? 0;
  mealNoon.value = data.meals?.noon ?? 0;
  mealEvening.value = data.meals?.evening ?? 0;
  mealMidnight.value = data.meals?.midnight ?? 0;

  mealAmount.value = data.mealAmount ?? '';
  focusInput.value = data.focus ?? '';
});

/* ===== 計算処理（改造前 完全復元） ===== */
calcBtn.addEventListener('click', () => {
  const max = Number(maxInput.value);
  const setWeight = Number(setWeightInput.value);
  const reps = Number(repsInput.value);
  const energy = Number(energyInput.value);
  const pain = Number(painInput.value);
  const sleep = Number(sleepInput.value);

  if (!setWeight || !reps) return;

  const mealCount = [mealMorning, mealNoon, mealEvening, mealMidnight]
    .reduce((acc, el) => acc + Number(el.value || 0), 0);

  const mealF = mealFactor(mealAmount.value) * (mealCount / 4);
  const focusF = focusFactor(focusInput.value);

  /* ① Epley式 */
  let estimated = setWeight * (1 + reps / 30);

  /* ② 補正係数 */
  let energyF = 1 - ((100 - energy) / 100 * 0.05);
  let painF = painCorrection(pain);
  let sleepF = sleep >= 7 ? 1 : Math.max(0.85, 0.95 + 0.01 * (sleep - 4));

  /* ③ 最終1RM */
  let finalRM = estimated * energyF * painF * sleepF * mealF * focusF;
  finalRM = Math.min(finalRM, estimated * 1.1);
  finalRM = Math.max(finalRM, estimated * 0.85);

  /* 表示 */
  estimatedRM.textContent = `${roundWeight(estimated)} kg`;
  safeWeight.textContent = `${roundWeight(finalRM * 0.9)} kg`;
  challengeWeight.textContent = `${roundWeight(finalRM * 0.95)} kg`;
  todayMax.textContent = `${roundWeight(finalRM)} kg`;

  /* RPE（改造前と同一） */
  let usage = setWeight / finalRM + (reps - 1) * 0.015;
  usage += (100 - energy) * 0.0015;
  if (pain >= 60) usage += 0.1;
  else if (pain >= 30) usage += 0.05;

  let rpeVal = Math.min(10, Math.max(1, Math.round(usage * 10 * 10) / 10));
  rpe.textContent = `RPE ${rpeVal}`;

  if (rpeVal <= 3) rpeLabel.textContent = '余裕';
  else if (rpeVal <= 6.9) rpeLabel.textContent = 'まだ行ける';
  else if (rpeVal <= 7.9) rpeLabel.textContent = 'ちょっと疲れた';
  else if (rpeVal <= 8.9) rpeLabel.textContent = 'もうダメ';
  else if (rpeVal <= 9.9) rpeLabel.textContent = 'ちょっと限界？';
  else rpeLabel.textContent = '限界';

  overlay.classList.remove('hidden');
});

/* ===== 閉じる ===== */
closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
});
