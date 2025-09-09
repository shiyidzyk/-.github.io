document.addEventListener('DOMContentLoaded', function() {
    // 翻转卡片功能
    const card = document.querySelector('.card');
    const typewriterText = document.getElementById('blessing-text');
    const fullText = typewriterText.textContent;
    let typeIndex = 0;
    let typeInterval;

    function startTypewriter() {
        typewriterText.innerHTML = '<span class="typewriter-cursor"></span>';
        typeIndex = 0;
        clearInterval(typeInterval);
        typeInterval = setInterval(() => {
            if (typeIndex < fullText.length) {
                // 先去掉所有光标，再插入新字符和光标
                let currentText = typewriterText.innerHTML.replace(/<span class=\"typewriter-cursor\"><\/span>/g, '');
                typewriterText.innerHTML = currentText + fullText[typeIndex] + '<span class="typewriter-cursor"></span>';
                typeIndex++;
            } else {
                clearInterval(typeInterval);
                // 打字结束后光标继续闪烁在末尾
                typewriterText.innerHTML = fullText + '<span class="typewriter-cursor"></span>';
            }
        }, 130); // 每130ms一个字，可调整速度
    }

    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
        // 如果音乐未播放，尝试播放
        if (audioPlayer.paused) {
            audioPlayer.play();
        }
        // 翻回正面时自动停止音乐
        if (!this.classList.contains('flipped')) {
            audioPlayer.pause();
        }
        if (this.classList.contains('flipped')) {
            startTypewriter();
        } else {
            typewriterText.innerHTML = fullText; // 卡片翻回正面时光标消失
            clearInterval(typeInterval);
        }
    });

    // 添加动画效果
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 150);
        });
    });

    // 页面加载动画
    const elements = document.querySelectorAll('.card, .gallery');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + index * 200);
    });

    // 音乐播放器入场动画
    const musicPlayer = document.querySelector('.music-player');
    setTimeout(() => {
        musicPlayer.classList.add('player-animate-in');
    }, 800); // 页面加载后延时触发动画

    // 音乐播放器功能
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const vinylImage = document.getElementById('vinylImage');
    const songTitle = document.querySelector('.song-title');
    const artist = document.querySelector('.artist');
    
    // 模拟音乐列表（实际使用时替换为真实音乐文件）
    const songs = [
        {
            title: "感恩的心",
            artist: "感恩老师的辛勤付出",
            src: "music/感恩的心.mp3" 
        },
        {
            title: "听我说谢谢你",
            artist: "谢谢老师对我们的包容与理解",
            src: "music/听我说谢谢你.mp3" 
        }
    ];
    
    // 随机选择第一首歌
    let currentSongIndex = Math.floor(Math.random() * songs.length);
    
    // 更新歌曲信息
    function loadSong(song) {
        songTitle.textContent = song.title;
        artist.textContent = song.artist;
        audioPlayer.src = song.src;
    }
    
    // 播放/暂停切换
    function togglePlay() {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    }
    
    // 播放歌曲
    function playSong() {
        audioPlayer.play()
            .then(() => {
                playBtn.textContent = '⏸';
                // 开始旋转
                vinylImage.classList.add('playing');
            })
            .catch(e => {
                console.log('播放失败:', e);
            });
    }
    
    // 暂停歌曲
    function pauseSong() {
        audioPlayer.pause();
        playBtn.textContent = '▶';
        // 停止旋转
        vinylImage.classList.remove('playing');
    }
    
    // 更新进度条
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // 更新时间显示
        currentTimeEl.textContent = formatTime(currentTime);
        if (duration) {
            durationEl.textContent = formatTime(duration);
        }
    }
    
    // 设置进度条
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // 格式化时间
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    // 切换到上一首
    function prevSong() {
        switchSong(false); // false表示上一首
    }
    
    // 切换到下一首
    function nextSong() {
        switchSong(true); // true表示下一首
    }
    
    // 切换歌曲并控制旋转效果
    function switchSong(isNext = true) {
        // 获取当前播放状态
        const wasPlaying = !audioPlayer.paused;
        
        // 停止旋转
        vinylImage.classList.remove('playing');
        
        // 复位旋转角度并添加过渡效果
        vinylImage.style.transition = 'transform 0.5s ease-in-out';
        vinylImage.style.transform = 'rotate(0deg)';
        
        // 计算下一首歌曲索引
        if (isNext) {
            currentSongIndex++;
            if (currentSongIndex > songs.length - 1) {
                currentSongIndex = 0;
            }
        } else {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1;
            }
        }
        
        // 加载新歌曲
        loadSong(songs[currentSongIndex]);
        
        // 如果之前是播放状态，则继续播放
        if (wasPlaying) {
            // 等待复位动画完成后再开始播放
            setTimeout(() => {
                // 清除过渡效果
                vinylImage.style.transition = '';
                playSong();
            }, 500); // 等待复位动画完成
        } else {
            // 如果之前是暂停状态，清除过渡效果
            setTimeout(() => {
                vinylImage.style.transition = '';
            }, 500);
        }
    }
    
    // 事件监听器
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    audioPlayer.addEventListener('ended', function() {
        nextSong();
    });
    
    // 初始化
    loadSong(songs[currentSongIndex]);
    durationEl.textContent = '0:00';
    currentTimeEl.textContent = '0:00';

    // 自动播放音乐，若被阻止则等待用户首次点击页面再播放
    function tryAutoPlay() {
        audioPlayer.play().then(() => {
            playBtn.textContent = '⏸';
        }).catch(() => {
            document.body.addEventListener('click', userPlayOnce, { once: true });
        });
    }
    function userPlayOnce() {
        audioPlayer.play();
    }
    // 监听audio播放/暂停事件，同步按钮状态
    audioPlayer.addEventListener('play', function() {
        playBtn.textContent = '⏸';
    });
    audioPlayer.addEventListener('pause', function() {
        playBtn.textContent = '▶';
    });
    tryAutoPlay();
});