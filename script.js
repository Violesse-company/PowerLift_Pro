const setWeightInput = document.getElementById('setWeightInput');
const repsInput = document.getElementById('repsInput');
const energyInput = document.getElementById('energyInput');
const painInput = document.getElementById('painInput');
const calcBtn = document.getElementById('calcBtn');

const overlay = document.getElementById('resultOverlay');
const closeBtn = document.getElementById('closeBtn');

const rmValue = document.getElementById('rmValue');
const safeValue = document.getElementById('safeValue');
const challengeValue = document.getElementById('challengeValue');
const todayValue = document.getElementById('todayValue');

const ROUND = 2.5;

function roundWeight(val) {
  return Math.round(val / ROUND) * ROUND;
}

function painCorrection(pain) {
  if (pain <= 30) return 1.0;
  if (pain <= 60) return 0.95;
  return 0.90;
}

calcBtn.addEventListener('click', () => {
  const setWeight = Number(setWeightInput.value);
  const reps = Number(repsInput.value);
  const energy = Number(energyInput.value);
  const pain = Number(painInput.value);

  if (!setWeight || !reps) return;

  // ① Epley式
  const estimated1RM = setWeight * (1 + reps / 30);

  // ② 補正係数
  const energyFactor = energy / 100;
  const painFactor = painCorrection(pain);

  // ③ 最終1RM
  const final1RM = estimated1RM * energyFactor * painFactor;

  rmValue.textContent = `${roundWeight(estimated1RM)} kg`;
  safeValue.textContent = `${roundWeight(final1RM * 0.9)} kg`;
  challengeValue.textContent = `${roundWeight(final1RM * 0.95)} kg`;
  todayValue.textContent = `${roundWeight(final1RM)} kg`;

  overlay.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  setWeightInput.value = '';
  repsInput.value = '';
  energyInput.value = 100;
  painInput.value = 0;
});

  // ダブルタップズーム防止
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // ピンチズーム防止
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
});