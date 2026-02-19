import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const encouragementNames = [
  "أسطوري", "خارق", "مميز", "مذهل", "رائع", "فريد", "لا يُقهر",
  "ممتاز", "رائع جدًا", "فائق", "مبهر", "مذهل", "متألق",
  "ممتاز جدًا", "لا يُضاهى", "بطل", "ممتاز للغاية",
  "متفوق", "خارق", "مذهل جدًا", "عبقري", "أسطوري جدًا"





  


  
  









  






  
];





















const URL = "https://ramdanmubarak-f7ykzrzw.b4a.run"; 


const socket = io(URL, {
  // بنخلي الـ websocket الأول عشان السرعة في الألعاب التفاعلية
  transports: ["websocket", "polling"], 
  
  // بنخلي الـ upgrade مسموح به عشان لو الـ websocket واجه مشكلة ينزل للـ polling تلقائياً
  upgrade: true, 
  







});


const RamadanWrapper = ({ children }) => (
  <div style={styles.container}>
    {/* خلفية النجوم المتلألئة */}
    <div className="stars"></div>
    
    {/* هلال ذهبي متوهج في الزاوية */}
    <div className="royal-moon">🌙</div>
    
    {/* نجوم متحركة في أركان الشاشة */}
    <div className="star-top-right">✨</div>
    <div className="star-bottom-left">✨</div>

    <div style={styles.glassCard}>
      {children}
    </div>

    <style>{`
      @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
      @keyframes moonFloat { 0%, 100% { transform: translateY(0) rotate(0deg); filter: drop-shadow(0 0 10px #fbbf24); } 50% { transform: translateY(-20px) rotate(5deg); filter: drop-shadow(0 0 30px #fbbf24); } }
      
      .stars { position: absolute; inset: 0; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.5; }
      .royal-moon { position: absolute; top: 5%; left: 5%; font-size: 80px; animation: moonFloat 5s infinite ease-in-out; z-index: 1; }
      .star-top-right { position: absolute; top: 10%; right: 10%; font-size: 40px; animation: twinkle 3s infinite; }
      .star-bottom-left { position: absolute; bottom: 10%; left: 10%; font-size: 30px; animation: twinkle 4s infinite; }
      
      /* إطار ذهبي متحرك للكارت */
      .glass-card-border { border: 2px solid #fbbf24; box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
    `}</style>
  </div>
);





export default function Puzzle({ images = [], playerName = "Player", isMuted: externalMuted }) {
  const [gameImages, setGameImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentHint, setCurrentHint] = useState("");
  const isAdminView = playerName === "Admin";
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("neutral");
  const [time, setTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState([]);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [finalResults, setFinalResults] = useState(false);
  const [skipAvailable, setSkipAvailable] = useState(false);
  const [leader, setLeader] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef(null);
  const readySound = useRef(new Audio("/sounds/ready.mp3"));
  const unreadySound = useRef(new Audio("/sounds/unready.mp3"));
  const audioCtx = useRef(null);

  const playTick = () => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = "square"; osc.frequency.value = 900; gain.gain.value = 0.05;
    osc.connect(gain); gain.connect(audioCtx.current.destination);
    osc.start(); osc.stop(audioCtx.current.currentTime + 0.1);
  };



const [isMuted, setIsMuted] = useState(externalMuted);



  const bgMusic1 = useRef(new Audio("/sounds/ramdan-music.mp3"));
const bgMusic2 = useRef(new Audio("/sounds/ramdan-ygmanaa.mp3"));

  const imgs = gameImages.length ? gameImages : images; 
  const img = imgs[index];






  













  

useEffect(() => {
    [bgMusic1, bgMusic2].forEach(music => {
      music.current.muted = isMuted;
    });


 const playBG = () => {
    [bgMusic1, bgMusic2].forEach(music => {
      music.current.loop = true;
      music.current.volume = 0.3;
      // السطر ده هو السر: بيخلي الصوت مكتوم أو شغال بناءً على اختيار اللاعب
      music.current.muted = isMuted; 
      
      music.current.play().catch(e => console.log("Audio play blocked"));
    });
  };

  playBG();
  socket.on("gameStarted", (receivedImages) => {
    console.log("اللعبة بدأت! استلمنا الأسئلة:", receivedImages);
    setGameImages(receivedImages); // ده اللي هيخلي الـ imgs.length أكبر من 0 والشاشة تفتح
    setIndex(0); // التأكد من البدء من أول سؤال
    setIsFinished(false);
    setShowResults(false);
  });

  return () => socket.off("gameStarted");








  

  

}, [isMuted]);

  useEffect(() => {
    socket.emit("join", playerName);
    socket.on("updateScores", (data) => {
      if (isFinished) return;
      if (!showResults && !showEncouragement && !finalResults) {
        setScores(data.scores);
        setLeader(data.leader);
      }
    });
    socket.on("globalSkipEnable", (data) => {
      if (isFinished) return;
      if (data.index === index) setSkipAvailable(true);
    });
    return () => {
      socket.off("updateScores");
      socket.off("globalSkipEnable");
    };
  }, [index, showResults, finalResults, showEncouragement, isFinished]);

  useEffect(() => {
    if (!img || isFinished) return;
    setCurrentHint("");
    socket.emit("requestHint", index);
    socket.on("receiveHint", (data) => {
      if (data.index === index) setCurrentHint(data.text);
    });
    setAnswer("");
    setStatus("neutral");
    setTime(img.duration * 60);
    setShowResults(false);
    setSkipAvailable(false);
    socket.emit("checkSkipStatus", { index });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); skip(); return 0; }
        if (t <= 3 && !isFinished) playTick();
        return t - 1;
      });
    }, 1000);
    return () => {
      socket.off("receiveHint");
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index, img, isFinished]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const submit = () => {
    const isCorrect = answer.trim().toLowerCase() === img.answer.toLowerCase();
    socket.emit("playerAnswer", { isCorrect, index });
    setStatus(isCorrect ? "correct" : "wrong");
    isCorrect ? readySound.current.play().catch(() => {}) : unreadySound.current.play().catch(() => {});
  };

  const skip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    socket.emit("requestScores");
    setSkipAvailable(false);
    if (index + 1 >= imgs.length) {
      setIsFinished(true);



      
      bgMusic1.current.pause();
    bgMusic2.current.pause();
      if (leader === playerName) setShowEncouragement(true);
      else { setShowResults(true); setFinalResults(true); }
    } else {
      setShowResults(true);
      setFinalResults(false);
    }
  };

  const nextQuestion = () => {
    if (index + 1 >= imgs.length) { setShowResults(true); setFinalResults(true); return; }
    setShowResults(false); setFinalResults(false); setIndex(i => i + 1);
  };

  const refreshScores = () => {
    socket.emit("requestScores");
    socket.once("updateScores", (data) => setScores(data.scores));
  };

  if (!imgs.length) return <RamadanWrapper><div style={{ color: "white", fontSize: 24 }}>في انتظار بدء اللعبة... 🌙</div></RamadanWrapper>;

  // شاشة التهنئة للفائز
  if (showEncouragement) {
    return (
      <RamadanWrapper>
        <div style={styles.resultsCard}>
          <button style={styles.next} onClick={() => { setShowEncouragement(false); setFinalResults(true); setShowResults(true); }}>Skip</button>
          <h2 style={{ color: "#fbbf24" }}>🎉 ألف مبروك يا بطل! 🎉</h2>
          <h2 style={{ marginBottom: 20 }}>{playerName} — {scores.find(p=>p.name===playerName)?.score || 0} ⭐</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", fontSize: 18, color: "#fff" }}>
            {encouragementNames.map((n, i) => (<span key={i} style={styles.badge}>{n}</span>))}
          </div>
        </div>
      </RamadanWrapper>
    );
  }

  // شاشة النتائج النهائية
  if (showResults || finalResults) {
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <RamadanWrapper>
        <div style={styles.resultsCard}>
          {!finalResults && (<div style={styles.arrow} onClick={nextQuestion}>⬅️ السؤال التالي</div>)}
          <h2 style={{ color: "#fbbf24", marginBottom: 20 }}>📊 ترتيب الأبطال</h2>
          <ul style={{ width: "100%", padding: 0 }}>
            {scores.filter(p => p.score > 0).map((p, i) => (
              <li key={p.name} style={styles.scoreItem}>
                <span style={{color: '#1e1b4b'}}>{medals[i] || ""} {p.name}</span>
                <strong style={{color: '#1e1b4b'}}>{p.score} نقطة</strong>
              </li>
            ))}
          </ul>
          {finalResults && (
            <div style={{marginTop: 20}}>
              <button onClick={refreshScores} style={styles.refreshBtn}>🔄 تحديث النهائي</button>
              <h3 style={{color: "#fbbf24", marginTop: 20}}>رمضان كريم وكل عام وأنتم بخير 🌙</h3>
              <p style={{opacity: 0.8}}>مع تحيات الأدمن وكل فريق العمل</p>
            </div>
          )}
        </div>
      </RamadanWrapper>
    );
  }

return (
    <RamadanWrapper>
      {/* تم تعديل style.card هنا ليكون مرن مع الموبايل flexDirection: column */}
      <div style={{...styles.card, flexDirection: 'column', height: 'auto', maxHeight: '95vh', overflowY: 'auto', gap: '15px', padding: '15px'}}>
        
        {/* صندوق المحتوى (صورة أو سؤال) */}
        <div style={{...styles.imageBox, flex: 'none', height: '250px', width: '100%'}}>
          {img.type === "image" ? (
             <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', fontSize: '20px', textAlign: 'center', padding: '10px' }}>
               {img.question}
             </div>
          )}
        </div>

        {/* الجانب الخاص بالتحكم (التايمر والإدخال) */}
        <div style={{...styles.side, flex: 'none', width: '100%', gap: '10px'}}>




















          {/* زرار كتم الصوت الجديد */}
  <button 
    onClick={() => setIsMuted(!isMuted)} 
    style={styles.muteBtn}
  >
    {isMuted ? "🔇 تشغيل الصوت" : "🔊 كتم الموسيقى"}
  </button>
          <div style={{...styles.timer, fontSize: '28px'}}>⏰ {formatTime(time)}</div>
          
          {isAdminView && (
            <div style={{...styles.adminPanel, flexDirection: 'row'}}>
              <input id="hintInput" placeholder="اكتب تلميحاً..." style={{...styles.adminInput, width: '70%'}} />
              <button onClick={() => {
                const val = document.getElementById('hintInput').value;
                if(val) socket.emit("sendHint", { index, text: val });
                document.getElementById('hintInput').value = "";
              }} style={styles.adminBtn}>إرسال 💡</button>
            </div>
          )}

          {currentHint && <div style={{...styles.hintBox, fontSize: '16px', padding: '10px'}}>💡 تلميح: {currentHint}</div>}

          {/* لو سؤال اختياري يظهر أزرار، لو صورة يظهر حقل إدخال */}
          {img.type === "quiz" ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              {img.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => { setAnswer(opt); setTimeout(submit, 100); }}
                  style={{ 
                    padding: '12px 5px', 
                    borderRadius: '10px', 
                    border: '1px solid #fbbf24', 
                    background: answer === opt ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    color: answer === opt ? '#1e1b4b' : '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input 
              value={answer} 
              onChange={e => setAnswer(e.target.value)} 
              placeholder="اكتب الإجابة هنا..." 
              style={{ ...styles.input, width: '100%', boxSizing: 'border-box', background: status === "correct" ? "#22c55e" : status === "wrong" ? "#ef4444" : "rgba(255,255,255,0.1)", color: "#fff" }} 
            />
          )}

          {!isAdminView && img.type !== "quiz" && <button onClick={submit} style={{...styles.submit, width: '100%'}}>إرسال الإجابة ✅</button>}
          {skipAvailable && (<button onClick={skip} style={{...styles.next, width: '100%', marginTop: '5px'}}>تخطي السؤال ⏭️</button>)}
        </div>
      </div>
    </RamadanWrapper>
  );
}




























const styles = {
  // --- الستايلات الأساسية (القديمة اللي كانت عندك) ---
  ramadanContainer: {
    height: "100vh", width: "100vw",
    background: "radial-gradient(circle, #1e1b4b 0%, #020617 100%)",
    display: "flex", justifyContent: "center", alignItems: "center",
    position: "relative", overflow: "hidden", fontFamily: 'Cairo, sans-serif'
  },
  contentWrapper: { zIndex: 10, width: "100%", display: "flex", justifyContent: "center" },
  card: { 
    width: "90%", height: "80%", background: "rgba(255, 255, 255, 0.05)", 
    backdropFilter: "blur(15px)", borderRadius: 24, display: "flex", gap: 30, padding: 30, 
    border: "1px solid rgba(251, 191, 36, 0.3)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" 
  },
  imageBox: { flex: 2, background: "rgba(0,0,0,0.2)", borderRadius: 15, padding: 10 },
  side: { flex: 1, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center", color: "white" },
  timer: { fontSize: 35, fontWeight: "bold", textAlign: "center", color: "#fbbf24", textShadow: "0 0 10px rgba(251,191,36,0.5)" },
  input: { padding: 15, borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)", fontSize: 20, textAlign: "center", outline: "none" },
  submit: { padding: 15, background: "#fbbf24", color: "#1e1b4b", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: "bold", fontSize: 18 },
  next: { padding: 12, background: "#16a34a", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" },
  resultsCard: { 
    width: "60%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", 
    borderRadius: 24, padding: 40, textAlign: "center", color: "white",
    border: "1px solid rgba(251, 191, 36, 0.4)"
  },
  scoreItem: { listStyle: "none", padding: 15, marginBottom: 12, background: "#fff", borderRadius: 12, display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: "bold" },
  hintBox: { background: "rgba(251, 191, 36, 0.2)", color: "#fbbf24", padding: 15, borderRadius: 12, border: "1px dashed #fbbf24", textAlign: "center", fontSize: 18 },
  adminPanel: { display: 'flex', gap: 10, background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 },
  adminInput: { flex: 1, padding: 8, borderRadius: 8, border: 'none', background: '#fff' },
  adminBtn: { background: '#f59e0b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 8, cursor: 'pointer' },














  



  muteBtn: {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fbbf24",
  border: "1px solid #fbbf24",
  padding: "8px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
  transition: "0.3s",
  alignSelf: "center",
  marginBottom: "5px"
},

  // --- ستايلات الموبايل الجديدة (اللي طلبتها) ---
  mobileCard: {
    width: "100%", height: "100%", 
    display: "flex", flexDirection: "column",
    padding: "20px", boxSizing: "border-box",
    justifyContent: "space-between"
  },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  timerMobile: { fontSize: "24px", color: "#fbbf24", fontWeight: "bold" },
  scoreBadge: { background: "#fbbf24", color: "#1e1b4b", padding: "5px 15px", borderRadius: "20px", fontWeight: "bold" },
  mainContent: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0" },
  imageContainer: { width: "100%", height: "100%", maxHeight: "40vh", borderRadius: "15px", overflow: "hidden", border: "2px solid rgba(251,191,36,0.3)" },
  responsiveImg: { width: "100%", height: "100%", objectFit: "contain" },
  quizContainer: { background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px solid #fbbf24" },
  questionText: { fontSize: "22px", color: "#fff", lineHeight: "1.4" },
  actionArea: { display: "flex", flexDirection: "column", gap: "10px" },
  optionsWrapper: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  optionBtn: { padding: "15px 10px", borderRadius: "10px", border: "1px solid #fbbf24", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  inputWrapper: { display: "flex", gap: "10px" },
  mobileInput: { flex: 1, padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid #fbbf24", outline: "none" },
  mobileSubmit: { padding: "12px 20px", background: "#fbbf24", color: "#1e1b4b", borderRadius: "10px", fontWeight: "bold", border: "none" },
  hintMobile: { background: "rgba(251,191,36,0.2)", color: "#fbbf24", padding: "8px", borderRadius: "8px", textAlign: "center", fontSize: "14px" },
  mobileSkip: { background: "#16a34a", color: "#fff", padding: "10px", borderRadius: "10px", border: "none", fontWeight: "bold", marginTop: "5px" },
  adminMobileRow: { display: "flex", gap: "5px", marginTop: "10px" },
  adminMobileInput: { flex: 1, background: "rgba(255,255,255,0.2)", border: "none", padding: "8px", borderRadius: "5px", color: "#fff" },
  adminMobileBtn: { background: "#f59e0b", border: "none", padding: "8px 15px", borderRadius: "5px", color: "#fff" }
};

















