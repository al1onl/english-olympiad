// --- Security Settings ---
const MAX_PARTICIPANTS = 100;
let participantCount = 0;
let participantsStarted = 0;

// --- State ---
const studentNumEl = document.getElementById('studentNum');
const loginEl = document.getElementById('login');
const passEl = document.getElementById('password');
const plaque = document.getElementById('plaque');
const plaqueDetail = document.getElementById('plaqueDetail');
const startBtn = document.getElementById('startBtn');
const tasks = document.getElementById('tasks');
const screens = {
  1: document.getElementById('task1'),
  2: document.getElementById('task2'),
  3: document.getElementById('task3')
};
const timerEl = document.getElementById('timer');
const prevBtn = document.getElementById('prevBtn');
const resultPanel = document.getElementById('resultPanel');
const contactBlock = document.getElementById('contactBlock');
const viewAnswersBtn = document.getElementById('viewAnswersBtn');
const viewNav = document.getElementById('viewNav');
const fullscreenWarning = document.getElementById('fullscreenWarning');
const fullscreenModal = document.getElementById('fullscreenModal');
const modalMessage = document.getElementById('modalMessage');
const securityWarning = document.getElementById('securityWarning');
const participantCounter = document.getElementById('participantCounter');
const participantsInfo = document.getElementById('participantsInfo');

// required credentials
const REQ_LOGIN = 'al1nol';
const REQ_PASS = 'olimpiada';

// timers: seconds remaining for each task (20 minutes = 1200s)
const INITIAL = 20 * 60;
let remaining = {1: INITIAL, 2: INITIAL, 3: INITIAL};
let activeTask = null;
let timerInterval = null;
let prevTarget = 1;
let finished = false;
let viewMode = false;
let currentViewTask = 1;
let fullscreenExitCount = 0;

// scoring plan
const RAW_MAX = 34;

// Security functions
function checkParticipantLimit() {
    participantCount++;
    participantsStarted++;
    
    updateParticipantCounters();
    
    if(participantCount > MAX_PARTICIPANTS) {
        alert('Олімпіада завершена! Максимальна кількість учасників досягнута. Дякуємо за участь!');
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #424242; color: white; flex-direction: column;">
                <h1>Олімпіада завершена! 🎉</h1>
                <p>Максимальна кількість учасників досягнута (${MAX_PARTICIPANTS})</p>
                <p style="margin-top: 20px; font-size: 14px; color: #ccc;">Дякуємо за інтерес до нашої олімпіади!</p>
            </div>
        `;
        return false;
    }
    return true;
}

function updateParticipantCounters() {
    if (participantCounter) {
        participantCounter.innerHTML = `Учасників: ${participantsStarted}/${MAX_PARTICIPANTS}`;
    }
    if (participantsInfo) {
        const remainingSlots = MAX_PARTICIPANTS - participantsStarted;
        participantsInfo.innerHTML = `Залишилось місць: <strong>${remainingSlots}</strong>`;
        
        if (remainingSlots < 10) {
            participantsInfo.style.background = '#fff3cd';
            participantsInfo.style.borderLeft = '4px solid #ffc107';
        }
    }
}

// Initialize student number on page load
function initializeStudentNumber() {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  studentNumEl.value = randInt(1, 1000);
  updateParticipantCounters();
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeStudentNumber();
});

// Fullscreen tracking
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenExitCount++;
    handleFullscreenExit();
  }
});

function handleFullscreenExit() {
  pauseTimer();
  showFullscreenModal();
  updateFullscreenWarning();
  
  if (fullscreenExitCount >= 10 && !finished) {
    setTimeout(() => {
      if (!document.fullscreenElement) {
        forceFinishTest();
      }
    }, 2000);
  }
}

function showFullscreenModal() {
  let message = '';
  
  if (fullscreenExitCount === 1) {
    message = 'Ви вийшли з повноекранного режиму. Будь ласка, поверніться для продовження тесту.';
  } else if (fullscreenExitCount <= 3) {
    message = `Ви вийшли з повноекранного режиму вже ${fullscreenExitCount} рази. Будь ласка, поверніться для продовження тесту.`;
  } else if (fullscreenExitCount <= 9) {
    message = `УВАГА! Ви вийшли з повноекранного режиму вже ${fullscreenExitCount} разів!<br>Якщо ви будете часто виходити з повноекранного режиму, тест буде примусово завершено!`;
  } else {
    message = `КРИТИЧНО! Ви вийшли з повноекранного режиму вже ${fullscreenExitCount} разів!<br>Тест буде примусово завершено!`;
  }
  
  modalMessage.innerHTML = message;
  fullscreenModal.style.display = 'flex';
}

function returnToFullscreen() {
  fullscreenModal.style.display = 'none';
  try {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(e => {
        console.log('Fullscreen failed:', e);
      });
    }
  } catch(e) {
    console.log('Fullscreen error:', e);
  }
  if (activeTask && !finished && !viewMode) {
    startTimerFor(activeTask);
  }
}

function updateFullscreenWarning() {
  if (fullscreenExitCount > 0 && !finished) {
    fullscreenWarning.style.display = 'block';
    fullscreenWarning.textContent = `Увага! Ви вийшли з повноекранного режиму ${fullscreenExitCount} разів.`;
    
    if (fullscreenExitCount >= 3 && fullscreenExitCount <= 9) {
      fullscreenWarning.innerHTML += `<br><strong>Якщо ви будете часто виходити з повноекранного режиму, тест буде примусово завершено!</strong>`;
    } else if (fullscreenExitCount >= 10) {
      fullscreenWarning.innerHTML += `<br><strong>ТЕСТ БУДЕ ПРИМУСОВО ЗАВЕРШЕНО!</strong>`;
    }
  }
}

function forceFinishTest() {
  if (!finished) {
    fullscreenWarning.style.display = 'block';
    fullscreenWarning.innerHTML = `<strong>ТЕСТ ПРИМУСОВО ЗАВЕРШЕНО!</strong><br>Занадто багато виходів з повноекранного режиму (${fullscreenExitCount} разів)`;
    
    finishTest();
    
    const fullscreenSummary = document.getElementById('fullscreenSummary');
    if (fullscreenSummary) {
      fullscreenSummary.innerHTML = `<span style="color:var(--danger);font-weight:700;">
        ТЕСТ ПРИМУСОВО ЗАВЕРШЕНО!<br>
        ${fullscreenExitCount} разів виходив, шо списав? Ну тоді 1 бал.<br>
        Гаразд, просто напишеш цей тест у очному форматі :)
      </span>`;
    }
  }
}

// plaque: slide up without overlapping inputs (stays above bottom)
function showPlaque(detail){
  plaque.style.display='block';
  plaque.style.transition='transform 0.35s ease, opacity 1s linear';
  plaque.style.opacity='1';
  plaque.style.transform = 'translateX(-50%) translateY(0%)';
  plaqueDetail.textContent = detail || '';
  setTimeout(()=>{ plaque.style.opacity='0'; },5000);
  setTimeout(()=>{ plaque.style.display='none'; plaque.style.transform='translateX(-50%) translateY(110%)'; plaqueDetail.textContent=''; },6100);
}

function validateLogin(){
  const L = loginEl.value.trim();
  const P = passEl.value.trim();
  if(L !== REQ_LOGIN || P !== REQ_PASS){
    const detail = (L !== REQ_LOGIN && P !== REQ_PASS) ? '(логін і пароль невірні)' : (L !== REQ_LOGIN ? '(логін невірний)' : '(пароль невірний)');
    document.getElementById('plaque').textContent = 'Невірний логін - пароль, Спробуй інший.';
    const small = document.createElement('div'); 
    small.style.fontWeight='400'; 
    small.style.fontSize='12px'; 
    small.style.marginTop='6px'; 
    small.textContent = detail;
    plaque.appendChild(small);
    showPlaque(detail);
    setTimeout(()=>{ if(plaque.lastChild) plaque.removeChild(plaque.lastChild); },6100);
    return false;
  }
  return true;
}

startBtn.addEventListener('click', ()=>{
  if(!validateLogin()) return;
  
  if(!checkParticipantLimit()) return;
  
  try{ 
    if(document.documentElement.requestFullscreen) 
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen failed:', e)); 
  }
  catch(e){ /* ignore */ }
  document.getElementById('intro').style.display='none';
  tasks.style.display='block';
  goTo(1);
});

// navigation and timer
function showScreen(n){
  for(const k in screens) {
    if(screens[k]) screens[k].classList.remove('active');
  }
  if(screens[n]) screens[n].classList.add('active');
  activeTask = n;
  prevTarget = n-1 >=1 ? n-1 : 1;
  if(prevBtn) {
    prevBtn.style.display = n>1 ? 'inline-block' : 'none';
    prevBtn.onclick = ()=>{ goTo(prevTarget); }
  }
  if(!finished && !viewMode) startTimerFor(n);
}

function goTo(n){
  if(activeTask===n) return;
  if(activeTask && !viewMode) pauseTimer();
  showScreen(n);
  window.scrollTo({top:0,behavior:'smooth'});
}

function startTimerFor(n){
  pauseTimer();
  timerInterval = setInterval(()=>{
    if(remaining[n] > 0) remaining[n]--;
    updateTimerDisplay(remaining[n]);
    if(remaining[n] === 0){
      clearInterval(timerInterval);
      if(n < 3) goTo(n+1);
    }
  },1000);
  updateTimerDisplay(remaining[n]);
}

function pauseTimer(){ 
  if(timerInterval) {
    clearInterval(timerInterval); 
    timerInterval = null; 
  }
}

function updateTimerDisplay(sec){ 
  const m=Math.floor(sec/60).toString().padStart(2,'0'); 
  const s=(sec%60).toString().padStart(2,'0'); 
  if(timerEl) timerEl.textContent = `${m}:${s}`; 
}

// Initialize timer display
updateTimerDisplay(INITIAL);

// View mode navigation
function navigateView(direction) {
  currentViewTask += direction;
  if (currentViewTask < 1) currentViewTask = 1;
  if (currentViewTask > 3) currentViewTask = 3;
  
  showScreen(currentViewTask);
  updateViewNavButtons();
}

function updateViewNavButtons() {
  if(document.getElementById('prevViewBtn') && document.getElementById('nextViewBtn')) {
    document.getElementById('prevViewBtn').disabled = currentViewTask === 1;
    document.getElementById('nextViewBtn').disabled = currentViewTask === 3;
  }
}

// correct answers maps
const correctTask1 = {
  t1s1:'synthesis', 
  t1s2:'short-sighted', 
  t1s3:'sporadic', 
  t1s4:'limitations', 
  t1s5:'detached', 
  t1s6:'overly', 
  t1s7:'nuance', 
  t1s8:'clarify', 
  t1s9:'ambiguous', 
  t1s10:'spurious', 
  t1s11:'inequalities', 
  t1s12:'adaptive'
};

const correctTask2MC = {
  r2q2:'C', 
  r2q4:'A', 
  r2q6:'A', 
  r2q8:'A', 
  r2q10:'A', 
  r2q12:'A'
};

function checkShort(id, arr){ 
  const el = document.getElementById(id);
  if(!el) return false;
  const v = el.value.trim().toLowerCase(); 
  if(!v) return false; 
  return arr.some(w=>v.includes(w)); 
}

// evaluate and finish
function finishTest(){
  if(finished) return;
  finished = true;
  pauseTimer();
  
  fullscreenModal.style.display = 'none';
  
  Array.from(document.querySelectorAll('input,select,textarea,button')).forEach(el=>{ 
    if(el.id !== 'viewAnswersBtn' && !el.classList.contains('view-nav-btn')) 
      el.disabled = true; 
  });

  let rawScore = 0;
  
  for(let i=1;i<=12;i++){
    const id = 't1s'+i; 
    const el = document.getElementById(id); 
    if(el) {
      const val = el.value; 
      if(val && val === correctTask1[id]) rawScore++; 
    }
  }
  
  Object.keys(correctTask2MC).forEach(id=>{ 
    const el = document.getElementById(id);
    if(el) {
      const v = el.value; 
      if(v && v === correctTask2MC[id]) rawScore++; 
    }
  });
  
  if(checkShort('r2q1',['path','dependent','histor'])) rawScore++;
  if(checkShort('r2q3',['inertia','budget','constraint','budgetary','politic'])) rawScore++;
  if(checkShort('r2q5',['equitable','viable','feasible'])) rawScore++;
  if(checkShort('r2q7',['justice'])) rawScore++;
  if(checkShort('r2q9',['includ','particip','stakehold','engag'])) rawScore++;
  if(checkShort('r2q11',['synthesis','data','justice','pragmatic'])) rawScore++;
  
  for(let i=1;i<=10;i++){ 
    const el = document.getElementById('t3q'+i);
    if(el) {
      const v = el.value.trim(); 
      if(v.length>3) rawScore++; 
    }
  }
  
  if(rawScore > RAW_MAX) rawScore = RAW_MAX;
  const final12 = Math.round(rawScore / RAW_MAX * 12);

  if(document.getElementById('scoreText')) {
    document.getElementById('scoreText').innerHTML = `Сирі бали: <strong>${rawScore}</strong> з ${RAW_MAX}. Оцінка за 12-бальною шкалою: <strong>${final12}/12</strong>`;
  }

  const totalRemain = remaining[1] + remaining[2] + remaining[3]; 
  const used = 3*INITIAL - totalRemain; 
  const mins = Math.floor(totalRemain/60); 
  const secs = totalRemain%60;
  
  if(document.getElementById('timeSummary')) {
    document.getElementById('timeSummary').innerHTML = `Залишок часу по завданнях: <strong>${mins} хв ${secs} с</strong>. Загальний використаний час: ${Math.floor(used/60)} хв ${used%60} с.`;
  }

  // Fullscreen summary with special messages
  if(document.getElementById('fullscreenSummary')) {
    let fullscreenText = `Кількість виходів з повноекранного режиму: ${fullscreenExitCount}`;
    
    if (fullscreenExitCount >= 3 && fullscreenExitCount <= 9) {
      fullscreenText += `<br><span style="color:var(--danger);font-weight:700;">
        ${fullscreenExitCount} разів виходив, шо списав? Ну тоді 1 бал.<br>
        Гаразд, просто напишеш цей тест у очному форматі :)
      </span>`;
    } else if (fullscreenExitCount >= 10) {
      fullscreenText += `<br><span style="color:var(--danger);font-weight:700;">
        ТЕСТ ПРИМУСОВО ЗАВЕРШЕНО!<br>
        ${fullscreenExitCount} разів виходив, шо списав? Ну тоді 1 бал.<br>
        Гаразд, просто напишеш цей тест у очному форматі :)
      </span>`;
    }
    
    document.getElementById('fullscreenSummary').innerHTML = fullscreenText;
  }

  const list = document.getElementById('answersList');
  if(list) {
    list.innerHTML='';
    list.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Короткий звіт по відповідям:</div>';
    list.innerHTML += `<div>Сирі бали: <strong>${rawScore}</strong> → <strong>${final12}/12</strong></div>`;
  }

  if(contactBlock) {
    contactBlock.innerHTML = `Telegram: <code>@nacodexx</code><br>Discord: <code>in.kyiv</code><br>Номер учня: <strong>${studentNumEl.value}</strong>`;
  }

  if(resultPanel) {
    resultPanel.style.display='block';
  }
  if(viewAnswersBtn) {
    viewAnswersBtn.disabled = false;
  }

  pauseTimer();
}

// view answers: highlight correct/incorrect and allow navigation (read-only)
function applyHighlights(){
  for(let i=1;i<=12;i++){
    const id='t1s'+i; 
    const el=document.getElementById(id); 
    if(!el) continue; 
    const val=el.value; 
    if(!val){ 
      el.classList.add('wrong-bg'); 
      continue; 
    } 
    if(val === correctTask1[id]) 
      el.classList.add('correct-bg'); 
    else 
      el.classList.add('wrong-bg'); 
  }
  
  Object.keys(correctTask2MC).forEach(id=>{ 
    const el=document.getElementById(id); 
    if(!el) return; 
    const val=el.value; 
    if(val === correctTask2MC[id]) 
      el.classList.add('correct-bg'); 
    else 
      el.classList.add('wrong-bg'); 
  });
  
  const shortChecks = {
    'r2q1':['path','dependent','histor'],
    'r2q3':['inertia','budget','constraint','budgetary','politic'],
    'r2q5':['equitable','viable','feasible'],
    'r2q7':['justice'],
    'r2q9':['includ','particip','stakehold','engag'],
    'r2q11':['synthesis','data','justice','pragmatic']
  };
  
  Object.keys(shortChecks).forEach(id=>{ 
    const el=document.getElementById(id); 
    if(!el) return; 
    if(checkShort(id, shortChecks[id])) 
      el.classList.add('correct-bg'); 
    else 
      el.classList.add('wrong-bg'); 
  });
  
  for(let i=1;i<=10;i++){ 
    const el=document.getElementById('t3q'+i); 
    if(!el) continue; 
    if(el.value.trim().length>3) 
      el.classList.add('correct-bg'); 
    else 
      el.classList.add('wrong-bg'); 
  }
}

if(viewAnswersBtn) {
  viewAnswersBtn.addEventListener('click', ()=>{
    viewMode = true;
    if(viewNav) viewNav.style.display = 'flex';
    applyHighlights();
    Array.from(document.querySelectorAll('input,select,textarea')).forEach(el=>{ el.disabled = true; });
    if(prevBtn) prevBtn.style.display = 'inline-block';
    currentViewTask = 1;
    goTo(1);
    updateViewNavButtons();
    viewAnswersBtn.disabled = true;
  });
}

// expose functions
window.goTo = function(n){ 
  if(activeTask && !viewMode) pauseTimer(); 
  showScreen(n); 
}
window.finishTest = finishTest;
window.navigateView = navigateView;
window.returnToFullscreen = returnToFullscreen;

// keyboard enter
const loginForm = document.getElementById('loginForm');
if(loginForm) {
  loginForm.addEventListener('keydown', (e)=>{ 
    if(e.key === 'Enter'){ 
      startBtn.click(); 
    } 
  });
}

// on visibility change pause timers
document.addEventListener('visibilitychange', ()=>{ 
  if(document.hidden) {
    pauseTimer(); 
  } else if(activeTask && !finished && !viewMode) {
    startTimerFor(activeTask); 
  }
});
