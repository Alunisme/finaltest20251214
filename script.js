// --- 題目資料分類 ---

// 1. 選擇題 (10題)
const mcqData = [
  { q: "若你使用望遠鏡頭拍攝人物，臉部會?", options: ["看起來變瘦變立體", "變形到像魚眼", "看起來較扁較壓縮", "自動消失"], ans: 2 },
  { q: "「曝光三角形」是指：快門速度、光圈，還有?", options: ["影像格式", "ISO", "飽和度", "白平衡"], ans: 1 },
  { q: "當你想保留雲的細節而不讓天空白掉，你應該?", options: ["切到夜景模式", "提高對比", "提高 ISO", "降低曝光"], ans: 3 },
  { q: "想讓天空顏色更深更飽和，常使用?", options: ["偏光濾鏡（CPL）", "微距濾鏡", "UV 鏡", "柔光鏡"], ans: 0 },
  { q: "用手機拍照時，對焦方法通常是?", options: ["隨機看運氣", "用自拍鏡頭拍", "放大兩倍後再按拍照", "點畫面上你要對焦的地方"], ans: 3 },
  { q: "連拍模式（Burst Mode）最適合?", options: ["拍靜物", "拍快速移動的人或球賽", "拍風景", "拍自拍"], ans: 1 },
  { q: "若你把相機靠得很近拍小物品，這叫做?", options: ["風景攝影", "棚拍", "微距攝影", "掃街"], ans: 2 },
  { q: "「RAW」檔的優點是?", options: ["檔案小、容易傳", "可直接變成影片", "自動變成 HDR", "保留更多後製空間與資訊"], ans: 3 },
  { q: "「HDR」功能主要用來?", options: ["讓畫面顏色變藍", "增加高光與暗部細節", "把照片變成影片", "自動修臉"], ans: 1 },
  { q: "「三分法構圖」是把畫面分成?", options: ["3x3 九格", "1個正方形", "兩半", "圓形構圖"], ans: 0 }
];

// 2. 是非題 (5題) - ans: true (O) / false (X)
const tfData = [
  { q: "在相同亮度下，提高快門速度會讓照片變暗，因為光線進入時間變短。", ans: true },
  { q: "「構圖」的主要目的只是為了增加照片的檔案容量。", ans: false },
  { q: "ISO 提高雖然會讓照片變亮，但也會導致雜訊變多。", ans: true },
  { q: "想要「定格」快速動作，你應該使用慢速快門。", ans: false },
  { q: "照片看起來偏黃或偏藍，通常是因為白平衡沒有調整好。", ans: true }
];

// 3. 拖拉配對題 (5題) - 描述對應名詞
const dragData = [
  { desc: "畫面中清楚的範圍", ans: "景深" },
  { desc: "背景模糊、人物清楚", ans: "大光圈" },
  { desc: "拍攝全身照並容納風景", ans: "廣角鏡頭" },
  { desc: "讓臉部看起來比較立體", ans: "側光" },
  { desc: "風景照片前後都清楚", ans: "小光圈" }
];

let lastIncorrectDetails = []; // 新增：用來儲存上一次的錯誤紀錄，供重新測驗時查看

// --- 1. YouTube API 設定 ---
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'uBrFVaci_cs', // 這裡放你要的 YouTube 影片 ID (例如: V7z7BAZdt2M 是 Canon 的教學)
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // 當影片播放結束 (0)
  if (event.data == YT.PlayerState.ENDED) {
    unlockTextSection();
  }
}

function unlockTextSection() {
  const textSection = document.getElementById('text-section');
  textSection.classList.remove('hidden');
  // 平滑捲動到文字區塊
  textSection.scrollIntoView({ behavior: 'smooth' });
}

// --- 2. 閱讀判定 (捲動到底部) ---
const btnReadComplete = document.getElementById('btn-read-complete');
let isReadComplete = false;

window.addEventListener('scroll', () => {
  // 如果文字區塊還沒顯示，就不偵測
  if (document.getElementById('text-section').classList.contains('hidden')) return;
  
  // 簡單的底部偵測：視窗高度 + 捲動高度 >= 文件總高度 - 100px (緩衝)
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    if (!isReadComplete) {
      btnReadComplete.disabled = false;
      btnReadComplete.innerText = "閱讀完畢 (點擊開啟測驗)";
      isReadComplete = true;
    }
  }
});

btnReadComplete.addEventListener('click', () => {
  const quizSection = document.getElementById('quiz-section');
  quizSection.classList.remove('hidden');
  quizSection.scrollIntoView({ behavior: 'smooth' });
  renderQuiz();
  // 隱藏按鈕避免重複點擊
  btnReadComplete.style.display = 'none';
});

// --- 3. 測驗邏輯 ---
function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  // --- Part 1: 選擇題 ---
  const mcqTitle = document.createElement('h2');
  mcqTitle.className = 'quiz-part-title';
  mcqTitle.innerText = 'Part 1: 選擇題';
  container.appendChild(mcqTitle);

  mcqData.forEach((item, index) => {
    const qDiv = document.createElement('div');
    qDiv.classList.add('quiz-item');
    
    const title = document.createElement('h3');
    title.innerText = `${index + 1}. ${item.q}`;
    qDiv.appendChild(title);

    item.options.forEach((opt, optIndex) => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.cursor = 'pointer';
      label.style.padding = '5px 0';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `mcq_${index}`;
      radio.value = optIndex;
      
      label.appendChild(radio);
      label.appendChild(document.createTextNode(` ${opt}`));
      qDiv.appendChild(label);
    });

    container.appendChild(qDiv);
  });

  // --- Part 2: 是非題 ---
  const tfTitle = document.createElement('h2');
  tfTitle.className = 'quiz-part-title';
  tfTitle.innerText = 'Part 2: 是非題';
  container.appendChild(tfTitle);

  tfData.forEach((item, index) => {
    const qDiv = document.createElement('div');
    qDiv.classList.add('quiz-item');
    
    const title = document.createElement('h3');
    title.innerText = `${index + 1}. ${item.q}`;
    qDiv.appendChild(title);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'tf-options';

    // O 按鈕
    const btnTrue = document.createElement('button');
    btnTrue.className = 'tf-btn';
    btnTrue.innerText = 'O (正確)';
    btnTrue.onclick = () => selectTF(index, true, btnTrue, btnFalse);
    
    // X 按鈕
    const btnFalse = document.createElement('button');
    btnFalse.className = 'tf-btn';
    btnFalse.innerText = 'X (錯誤)';
    btnFalse.onclick = () => selectTF(index, false, btnFalse, btnTrue);

    // 儲存選擇狀態的隱藏欄位
    qDiv.dataset.userAnswer = ""; 
    qDiv.id = `tf_item_${index}`;

    btnContainer.appendChild(btnTrue);
    btnContainer.appendChild(btnFalse);
    qDiv.appendChild(btnContainer);
    container.appendChild(qDiv);
  });

  // --- Part 3: 拖拉配對題 ---
  const dragTitle = document.createElement('h2');
  dragTitle.className = 'quiz-part-title';
  dragTitle.innerText = 'Part 3: 配對題 (請將下方答案拖入框中)';
  container.appendChild(dragTitle);

  const dragContainer = document.createElement('div');
  dragContainer.className = 'drag-container';

  // 建立放置區 (Drop Zones)
  dragData.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'match-row';

    const desc = document.createElement('div');
    desc.className = 'match-desc';
    desc.innerText = item.desc;

    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.index = index; // 紀錄這是第幾題
    
    // 綁定拖放事件
    dropZone.ondragover = (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    };
    dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
    dropZone.ondrop = (e) => handleDrop(e, dropZone);

    row.appendChild(desc);
    row.appendChild(dropZone);
    dragContainer.appendChild(row);
  });

  // 建立可拖曳物件池 (Draggable Items) - 隨機打亂
  const pool = document.createElement('div');
  pool.className = 'drag-pool';
  pool.id = 'drag-pool';

  // 準備答案陣列並打亂
  let answers = dragData.map(d => d.ans);
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(ans => {
    const dragItem = document.createElement('div');
    dragItem.className = 'draggable';
    dragItem.draggable = true;
    dragItem.innerText = ans;
    dragItem.id = `drag_${ans}`; // 用答案當 ID
    
    dragItem.ondragstart = (e) => {
      e.dataTransfer.setData("text", e.target.id);
    };
    pool.appendChild(dragItem);
  });

  container.appendChild(dragContainer);
  container.appendChild(pool);
}

// 是非題選擇邏輯
function selectTF(index, isTrue, btnSelected, btnOther) {
  const qDiv = document.getElementById(`tf_item_${index}`);
  qDiv.dataset.userAnswer = isTrue; // 存成 "true" 或 "false" 字串
  
  btnSelected.classList.add('selected');
  btnOther.classList.remove('selected');
}

// 拖放邏輯
function handleDrop(e, dropZone) {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const data = e.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  
  // 如果放置區已經有東西，把原本的東西丟回池子
  if (dropZone.children.length > 0) {
    const existingItem = dropZone.children[0];
    document.getElementById('drag-pool').appendChild(existingItem);
  }
  
  dropZone.appendChild(draggedElement);
}

document.getElementById('btn-submit-quiz').addEventListener('click', calculateScore);

function calculateScore() {
  let score = 0;
  let total = mcqData.length + tfData.length + dragData.length; // 10 + 5 + 5 = 20
  let answeredCount = 0;
  let incorrectDetails = []; // 用來儲存錯題資訊

  // 1. 計算選擇題分數
  for (let i = 0; i < mcqData.length; i++) {
    const radios = document.getElementsByName(`mcq_${i}`);
    for (let radio of radios) {
      if (radio.checked) {
        answeredCount++;
        if (parseInt(radio.value) === mcqData[i].ans) {
          score++;
        } else {
          incorrectDetails.push({
            type: "選擇題",
            no: i + 1,
            q: mcqData[i].q,
            userAns: mcqData[i].options[parseInt(radio.value)], // 紀錄使用者的錯誤回答
            ans: mcqData[i].options[mcqData[i].ans]
          });
        }
        break;
      }
    }
  }

  // 2. 計算是非題分數
  for (let i = 0; i < tfData.length; i++) {
    const qDiv = document.getElementById(`tf_item_${i}`);
    const userAns = qDiv.dataset.userAnswer;
    
    if (userAns !== "") {
      answeredCount++;
      // dataset 存的是字串 "true"/"false"，需轉換比較
      const isCorrect = (userAns === "true") === tfData[i].ans;
      if (isCorrect) {
        score++;
      } else {
        incorrectDetails.push({
          type: "是非題",
          no: i + 1,
          q: tfData[i].q,
          userAns: userAns === "true" ? "O (正確)" : "X (錯誤)", // 紀錄使用者的錯誤回答
          ans: tfData[i].ans ? "O (正確)" : "X (錯誤)"
        });
      }
    }
  }

  // 3. 計算配對題分數
  const dropZones = document.querySelectorAll('.drop-zone');
  dropZones.forEach(zone => {
    if (zone.children.length > 0) {
      answeredCount++;
      const itemText = zone.children[0].innerText;
      const questionIndex = zone.dataset.index;
      if (itemText === dragData[questionIndex].ans) {
        score++;
      } else {
        incorrectDetails.push({
          type: "配對題",
          no: parseInt(questionIndex) + 1,
          q: dragData[questionIndex].desc,
          userAns: itemText, // 紀錄使用者的錯誤回答
          ans: dragData[questionIndex].ans
        });
      }
    }
  });

  // 將本次錯誤紀錄存入全域變數，供重新測驗時使用
  lastIncorrectDetails = incorrectDetails;

  if (answeredCount < total) {
    alert("請回答完所有題目再送出！");
    return;
  }

  // 計算百分比分數
  let finalScore = Math.round((score / total) * 100);
  
  // 產生錯題列表 HTML
  let reviewHtml = "";
  if (incorrectDetails.length > 0) {
    reviewHtml = `
      <div style="margin-top: 20px; text-align: left; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; max-height: 300px; overflow-y: auto;">
        <h3 style="color: #ff6b6b; border-bottom: 1px solid #555; padding-bottom: 5px; margin-top: 0;">錯題檢討</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${incorrectDetails.map(item => `
            <li style="margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 5px;">
              <div style="font-size: 0.9rem; color: #ddd;">[${item.type} #${item.no}] ${item.q}</div>
              <div style="color: #ff6b6b;">您的回答：${item.userAns}</div>
              <div style="color: #00d2ff; font-weight: bold;">正確答案：${item.ans}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } else {
    reviewHtml = `<div style="margin-top: 20px; color: #4CAF50; font-weight: bold; font-size: 1.2rem;">太強了！全對！</div>`;
  }

  // --- 改進：顯示結果並提供按鈕 (避免彈跳視窗被擋) ---
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div style="text-align: center; padding: 30px; background: rgba(0,0,0,0.5); border-radius: 15px;">
      <h2 style="color: #00d2ff; margin-bottom: 20px;">測驗結束！</h2>
      <p style="font-size: 1.5rem; margin-bottom: 20px;">
        你的得分是：<span style="color: #fff; font-weight: bold; font-size: 2rem;">${finalScore}</span> 分 
        <span style="font-size: 1rem; color: #aaa;">(${score}/${total})</span>
      </p>

      <!-- 插入錯題檢討區塊 -->
      ${reviewHtml}
      
      <div style="margin: 20px 0;">
        <p>請輸入姓名以登記成績：</p>
        <input type="text" id="student-name" placeholder="你的姓名或學號" 
               style="padding: 10px; border-radius: 5px; border: none; width: 200px; text-align: center; font-size: 1rem;">
      </div>

      <button id="btn-upload-score">送出成績</button>
      <p style="font-size: 0.9rem; color: #aaa; margin-top: 10px;">(按下按鈕後將直接傳送成績)</p>
      <button id="btn-retake-quiz" style="background: #555; margin-top: 20px;">重新測驗</button>
    </div>
  `;

  // 隱藏原本的送出按鈕
  document.getElementById('btn-submit-quiz').style.display = 'none';

  // 重新測驗按鈕事件
  document.getElementById('btn-retake-quiz').onclick = function() {
    renderQuiz(); // 重新產生題目
    document.getElementById('btn-submit-quiz').style.display = ''; // 恢復顯示送出按鈕
    document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });

    // --- 新增：若有錯誤紀錄，顯示「查看上次錯誤」按鈕 ---
    if (lastIncorrectDetails.length > 0) {
      const container = document.getElementById('quiz-container');
      
      // 1. 建立錯誤紀錄顯示區 (預設隱藏)
      const reviewDiv = document.createElement('div');
      reviewDiv.style.display = 'none';
      reviewDiv.style.background = 'rgba(255, 100, 100, 0.1)'; // 淡紅色背景
      reviewDiv.style.padding = '20px';
      reviewDiv.style.borderRadius = '10px';
      reviewDiv.style.marginBottom = '20px';
      reviewDiv.style.border = '1px solid #ff6b6b';
      
      reviewDiv.innerHTML = `
        <h3 style="color: #ff6b6b; margin-top: 0; border-bottom: 1px solid rgba(255, 107, 107, 0.3); padding-bottom: 10px;">上次錯誤紀錄</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${lastIncorrectDetails.map(item => `
            <li style="margin-bottom: 15px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 10px;">
              <div style="font-size: 1rem; color: #fff; margin-bottom: 5px;">[${item.type} #${item.no}] ${item.q}</div>
            </li>
          `).join('')}
        </ul>
      `;

      // 2. 建立切換按鈕
      const reviewBtn = document.createElement('button');
      reviewBtn.innerText = '📋 查看上次錯誤紀錄 (點擊展開)';
      reviewBtn.style.background = '#ff6b6b'; // 紅色系按鈕
      reviewBtn.style.color = '#fff';
      reviewBtn.style.marginBottom = '20px';
      reviewBtn.style.width = '100%';
      
      reviewBtn.onclick = function() {
        const isHidden = reviewDiv.style.display === 'none';
        reviewDiv.style.display = isHidden ? 'block' : 'none';
        reviewBtn.innerText = isHidden ? '🔼 隱藏錯誤紀錄' : '📋 查看上次錯誤紀錄 (點擊展開)';
      };

      // 3. 插入到測驗卷的最上方
      container.insertBefore(reviewDiv, container.firstChild);
      container.insertBefore(reviewBtn, container.firstChild);
    }
  };

  // 綁定按鈕事件
  document.getElementById('btn-upload-score').onclick = function() {
    let studentName = document.getElementById('student-name').value.trim();
    if (!studentName) studentName = "匿名學生";

    // Google Form 設定
    const formID = "1FAIpQLSceVYxIR12OTAXFmucdY2kfAdyTU2wo2etgl0e0ye8b0Hr6dA"; 
    const submitURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;

    // 請將這裡換成你新增加的「錯題列表」欄位 ID
    const entryID_Wrong = "entry.1506409188"; 

    // 顯示傳送中狀態
    const btn = document.getElementById('btn-upload-score');
    btn.innerText = "傳送中...";
    btn.disabled = true;

    // 準備資料
    const formData = new FormData();
    
    // 整理錯題字串 (例如: "選擇題#1, 是非題#2")
    let wrongString = incorrectDetails.map(d => `${d.type}#${d.no}`).join(', ');
    if (!wrongString) wrongString = "無 (全對)";

    formData.append("entry.209037273", studentName);
    formData.append("entry.628831536", finalScore);
    formData.append(entryID_Wrong, wrongString); // 加入錯題資訊

    // 使用 fetch 發送 (no-cors 模式)
    fetch(submitURL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    }).then(() => {
      // 成功後更新介面
      btn.innerText = "已成功送出！";
      btn.style.background = "#4CAF50"; // 綠色
      btn.style.color = "white";
      alert("成績已成功傳送給老師！");
    }).catch((err) => {
      // 錯誤處理
      console.error("Error:", err);
      btn.innerText = "傳送失敗，請重試";
      btn.disabled = false;
      alert("傳送失敗，請檢查網路連線。");
    });
  };
}

// --- 5. 滑鼠點擊閃光效果 ---
document.addEventListener('click', (e) => {
  const flash = document.createElement('div');
  flash.className = 'click-flash';
  // 設定閃光位置在滑鼠尖端
  flash.style.left = `${e.clientX}px`;
  flash.style.top = `${e.clientY}px`;
  document.body.appendChild(flash);

  // 動畫結束後移除元素，避免記憶體堆積
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
});

// --- 6. 導覽列滑鼠感應動畫 ---
const nav = document.querySelector('nav');
document.addEventListener('mousemove', (e) => {
  // 當滑鼠在視窗上方 100px 內時顯示導覽列
  if (e.clientY < 100) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
});

// --- 7. HackMD 彈跳視窗邏輯 ---
const modalOverlay = document.getElementById('modal-overlay');
const modalIframe = document.getElementById('modal-iframe');
const modalClose = document.getElementById('modal-close');
const navLinks = document.querySelectorAll('.nav-links a');

// 綁定導覽列連結點擊事件
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // 阻止預設的跳轉行為
    const url = link.getAttribute('href');
    modalIframe.src = url; // 設定 iframe 網址
    modalOverlay.classList.remove('hidden'); // 顯示視窗
  });
});

// 關閉按鈕
modalClose.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
  modalIframe.src = ''; // 清空網址以停止載入
});

// 點擊背景也可以關閉
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
    modalIframe.src = '';
  }
});
