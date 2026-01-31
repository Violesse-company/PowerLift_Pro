const calcBtn = document.getElementById('calcBtn');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

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

const estimatedRM = document.getElementById('estimatedRM');
const safeWeight = document.getElementById('safeWeight');
const challengeWeight = document.getElementById('challengeWeight');
const todayMax = document.getElementById('todayMax');
const rpe = document.getElementById('rpe');
const rpeLabel = document.getElementById('rpeLabel');

const ROUND = 2.5;

// 端数処理
function roundWeight(val) {
  return Math.round(val / ROUND) * ROUND;
}

// 痛み補正
function painCorrection(pain) {
  if (pain <= 30) return 1.0;
  if (pain <= 60) return 0.95;
  return 0.9;
}

// 食事量補正
function mealFactor(value) {
  if (!value) return 1;
  return Number(value);
}

// 集中力補正
function focusFactor(value) {
  if (!value) return 1;
  return Number(value);
}

calcBtn.addEventListener('click', () => {
  const max = Number(maxInput.value);
  const setWeight = Number(setWeightInput.value);
  const reps = Number(repsInput.value);
  const energy = Number(energyInput.value);
  const pain = Number(painInput.value);
  const sleep = Number(sleepInput.value);

  // 食事合計
  const mealCount = [mealMorning, mealNoon, mealEvening, mealMidnight]
                      .reduce((acc, el) => acc + Number(el.value||0), 0);
  const mealF = mealFactor(mealAmount.value) * (mealCount / 4);
  const focusF = focusFactor(focusInput.value);

  if (!max || !setWeight || !reps) return;

  // ① 基本1RM Epley式
  let estimated = setWeight * (1 + reps/30);

  // ② 補正係数
  let energyF = 1 - ((100 - energy)/100 * 0.05);
  let painF = painCorrection(pain);
  let sleepF = sleep >=7 ? 1 : Math.max(0.85, 0.95 + 0.01*(sleep-4));

  // ③ 最終1RM（上限・下限で制限）
  let finalRM = estimated * energyF * painF * sleepF * mealF * focusF;
  finalRM = Math.min(finalRM, estimated * 1.1);
  finalRM = Math.max(finalRM, estimated * 0.85);

  // 結果表示
  estimatedRM.textContent = `${roundWeight(estimated)} kg`;
  safeWeight.textContent = `${roundWeight(finalRM * 0.9)} kg`;
  challengeWeight.textContent = `${roundWeight(finalRM * 0.95)} kg`;
  todayMax.textContent = `${roundWeight(finalRM)} kg`;

  // RPE計算（使用重量に対して）
  let usage = setWeight / finalRM + (reps - 1) * 0.015;
  usage += (100 - energy) * 0.0015;
  if (pain >= 60) usage += 0.1;
  else if (pain >= 30) usage += 0.05;

  let rpeVal = usage * 10;
  rpeVal = Math.min(10, Math.max(1, Math.round(rpeVal * 10)/10));
  rpe.textContent = `RPE ${rpeVal}`;

  // RPEラベル
  if (rpeVal <= 3) rpeLabel.textContent = '余裕';
  else if (rpeVal <= 6.9) rpeLabel.textContent = 'まだ行ける';
  else if (rpeVal <= 7.9) rpeLabel.textContent = 'ちょっと疲れた';
  else if (rpeVal <= 8.9) rpeLabel.textContent = 'もうダメ';
  else if (rpeVal <= 9.9) rpeLabel.textContent = 'ちょっと限界？';
  else rpeLabel.textContent = '限界';

  overlay.classList.remove('hidden');
});

// 閉じる
closeBtn.addEventListener('click', ()=>{
  overlay.classList.add('hidden');
  document.querySelectorAll('input').forEach(el => el.value = '');
});

// ダブルタップズーム防止
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event){
  const now = Date.now();
  if(now - lastTouchEnd <= 300) event.preventDefault();
  lastTouchEnd = now;
},{passive:false});

// ピンチズーム禁止
document.addEventListener('gesturestart', e => e.preventDefault());
