document.addEventListener('DOMContentLoaded', function () {
    const bucketList = document.getElementById('bucket-list');
    const newItemInput = document.getElementById('new-item');
    const addButton = document.getElementById('add-button');
    
    // 타이머 관련 요소
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');
    const alarmMinutesInput = document.getElementById('alarm-minutes');
    const setAlarmButton = document.getElementById('set-alarm-button');
    const workTimeDisplay = document.getElementById('work-time-display');
    
    let timerInterval;
    let timeLeft = 25 * 60; // 25분 설정
    let isTimerRunning = false;
    let alarmTimeout;
    let totalWorkSeconds = 0;
    
    // 로컬 스토리지에서 버킷리스트 불러오기
    loadBucketList();
    
    // 로컬 스토리지에서 작업 시간 불러오기
    loadWorkTime();

    // 버킷리스트 항목 추가 기능
    addButton.addEventListener('click', function () {
        const newItemText = newItemInput.value.trim();
        if (newItemText !== '') {
            addBucketItem(newItemText);
            newItemInput.value = '';
        }
    });

    newItemInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          addButton.click();
        }
    });

    // 버킷리스트 항목 토글 기능
    bucketList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            toggleBucketItem(event.target);
        }
    });

    // 타이머 시작 버튼 이벤트 리스너
    startButton.addEventListener('click', function () {
        if (!isTimerRunning) {
            startTimer();
        }
    });

    // 타이머 일시정지 버튼 이벤트 리스너
    pauseButton.addEventListener('click', function () {
        if (isTimerRunning) {
            pauseTimer();
        }
    });
    
    // 타이머 초기화 버튼 이벤트 리스너
    resetButton.addEventListener('click', function () {
        resetTimer();
    });

    // 알람 설정 버튼 이벤트 리스너
    setAlarmButton.addEventListener('click', function () {
        setAlarm();
    });
    
    // 버킷리스트 항목 추가 함수
    function addBucketItem(text) {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        bucketList.appendChild(listItem);
        saveBucketList();
    }

    // 버킷리스트 항목 토글 함수
    function toggleBucketItem(item) {
        item.classList.toggle('done');
        saveBucketList();
    }

    // 로컬 스토리지에 버킷리스트 저장 함수
    function saveBucketList() {
        const items = Array.from(bucketList.children).map(item => ({
            text: item.textContent,
            done: item.classList.contains('done')
        }));
        localStorage.setItem('bucketList', JSON.stringify(items));
    }

    // 로컬 스토리지에서 버킷리스트 불러오기 함수
    function loadBucketList() {
        const items = JSON.parse(localStorage.getItem('bucketList')) || [];
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.text;
            if (item.done) {
                listItem.classList.add('done');
            }
            bucketList.appendChild(listItem);
        });
    }
    
    // 타이머 시작 함수
    function startTimer() {
        if (!isTimerRunning) {
             isTimerRunning = true;
             timerInterval = setInterval(updateTimer, 1000);
        }
    }
    
    // 타이머 일시정지 함수
    function pauseTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
    
    // 타이머 초기화 함수
    function resetTimer() {
      pauseTimer();
      timeLeft = 25 * 60;
      updateDisplay();
    }
    
    // 타이머 업데이트 함수
    function updateTimer() {
        timeLeft--;
        if(timeLeft < 0) {
          pauseTimer();
          timeLeft = 0;
          // 알람 실행
          playAlarmSound();
        }
        updateDisplay();
        updateWorkTime();
    }

    // 타이머 디스플레이 업데이트 함수
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // 알람 설정 함수
    function setAlarm() {
      clearTimeout(alarmTimeout);
      const minutes = parseInt(alarmMinutesInput.value, 10) || 0;
      if(minutes > 0) {
          alarmTimeout = setTimeout(playAlarmSound, minutes * 60 * 1000);
      }
    }
    
    function playAlarmSound() {
        alert("타이머 종료! 휴식 시간입니다.");
    }
    
    // 작업 시간 업데이트 함수
    function updateWorkTime() {
      totalWorkSeconds++;
      const hours = Math.floor(totalWorkSeconds / 3600);
      const minutes = Math.floor((totalWorkSeconds % 3600) / 60);
      const seconds = totalWorkSeconds % 60;
    
      workTimeDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      saveWorkTime();
    }
    
    // 로컬 스토리지에 작업 시간 저장 함수
    function saveWorkTime() {
        localStorage.setItem('totalWorkSeconds', JSON.stringify(totalWorkSeconds));
    }
    
    // 로컬 스토리지에서 작업 시간 불러오기 함수
    function loadWorkTime() {
        totalWorkSeconds = JSON.parse(localStorage.getItem('totalWorkSeconds')) || 0;
        updateWorkTime();
    }
    
    updateDisplay();
});
