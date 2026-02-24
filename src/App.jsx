import React, { useState, useRef, useEffect } from "react";
import WaitingRoom from "./WaitingRoom";
import Admin from "./Admin";
import { socket } from "./socket";

export default function App() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  






  const bgRef = useRef(new Audio("/sounds/ramdan-music.mp3")); 
 

  useEffect(() => {
    const bg = bgRef.current;
    bg.loop = true;
    bg.volume = 0.35;



    return () => {
      bg.pause();
      bg.currentTime = 0;
    };




    


  }, []);






  
useEffect(() => {
    const bg = bgRef.current;

    // تشتغل فقط لو لسه مسجلش دخول ومش في صفحة الأدمن
    if (!joined && !isAdmin) {
      bg.play().catch(() => {
        console.log("برجاء التفاعل مع الصفحة لتشغيل الصوت");
      });
    } else {
      // تقف فوراً لو دخلت الويتنج روم أو الأدمن
      bg.pause();
      bg.currentTime = 0; 
    }
  }, [joined, isAdmin]); // بتراقب الحالتين مع بعض


 const handleJoin = (e) => {
  e.preventDefault();
  const trimmed = name.trim();
  if (!trimmed) return;

  // إيقاف موسيقى صفحة الدخول فوراً
  bgRef.current.pause();
  bgRef.current.currentTime = 0;

  setName(trimmed);
  setJoined(true);
};

  const openAdmin = () => {
    setShowAdminLogin(true);
    setAdminPass("");
    setWrongPass(false);
    setShowPass(false);
  };

  const handleAdminLogin = () => {
    if (adminPass === "admin1234") {
      setWrongPass(false);
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      setWrongPass(true);
    }
  };

  if (isAdmin) {
    return <Admin logout={() => setIsAdmin(false)} />;
  }

  return (



    <div style={styles.container}>
      {/* نجوم متلألئة في الخلفية */}
      <div className="stars"></div>
      
      {/* هلال زينة */}
      <div style={styles.crescentDecoration}>🌙</div>

      {!joined ? (
        <>
          <div style={styles.settingsCorner} onClick={openAdmin}>
            ⚙️ الإعدادات
          </div>

          <div style={styles.card}>
            {showAdminLogin ? (
              <>
                <h2 style={styles.ramadanTitle}>دخول الإدارة 🌙</h2>
                <div style={{ position: "relative", width: "100%", marginTop: 10 }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="كلمة السر الخاصة بهشام..."
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    style={styles.input}
                
                
                />
                  <span onClick={() => setShowPass(!showPass)} style={styles.eyeIcon}>
                    {showPass ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>
                {wrongPass && <p style={styles.errorBox}>❌ كلمة السر غير صحيحة</p>}
                <button onClick={handleAdminLogin} style={styles.button}>دخول</button>
                <button onClick={() => setShowAdminLogin(false)} style={styles.backButton}>رجوع</button>
              </>
            ) : (
              <>
                <h1 className="title"> 7ASANAT  </h1>
                <h2 style={styles.subtitle}>     رمضان احلي مع ليل 🌙 </h2>
                <form onSubmit={handleJoin}>
                  <input
                    type="text"
                    placeholder="اكتب اسمك يا بطل..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.button}>دخول اللعبة 🌙</button>
                </form>
              </>
            )}
          </div>
        </>
      ) : (
        <WaitingRoom name={name} bgRef={bgRef} />
      )}

      <style>{`










        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url('https://www.transparenttextures.com/patterns/stardust.png');
          animation: twinkle 3s infinite;
          pointer-events: none;
        }












        

        @keyframes glowTitle {
          0%, 100% { text-shadow: 0 0 10px #fbbf24; }
          50% { text-shadow: 0 0 25px #fbbf24, 0 0 35px #fbbf24; }
        }
        .title {
          color: #fbbf24;
          font-size: 42px;
          margin-bottom: 10px;
          font-family: 'serif';
          animation:   shake 0.8s ease infinite, glowTitle 2s ease-in-out infinite;
        }




        
           @keyframes shake {

          0%,100%{transform:translateX(0);}

          25%{transform:translateX(-5px);}

          50%{transform:translateX(5px);}

          75%{transform:translateX(-5px);}

        }

      `}</style>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Cairo', sans-serif",
    overflow: "hidden",
    background: "radial-gradient(circle, #1e1b4b 0%, #020617 100%)", // خلفية كحلية ملكية
    position: "relative"
  },
  crescentDecoration: {
    position: "absolute",
    top: "10%",
    right: "10%",
    fontSize: "80px",
    filter: "drop-shadow(0 0 20px #fbbf24)",
    opacity: 0.6,
    pointerEvents: "none"
  },
  settingsCorner: {
    position: "absolute",
    top: 20,
    left: 20,
    background: "rgba(251, 191, 36, 0.2)",
    color: "#fbbf24",
    padding: "10px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "1px solid rgba(251, 191, 36, 0.4)",
    fontWeight: "bold",
    zIndex: 30,
    backdropFilter: "blur(5px)"
  },
  card: {
    background: "rgba(255, 255, 255, 0.07)",
    backdropFilter: "blur(15px)",
    padding: "50px 40px",
    borderRadius: "30px",
    width: "90%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0px 10px 40px rgba(0,0,0,0.5)",
    border: "1px solid rgba(251, 191, 36, 0.2)",
    zIndex: 10
  },
  ramadanTitle: {
    color: "#fbbf24",
    marginBottom: "20px"
  },
  subtitle: {
    color: "#e2e8f0",
    marginBottom: "30px",
    fontSize: "18px",
    opacity: 0.8,
  },
  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    fontSize: "16px",
    color: "#fff",
    outline: "none",
    textAlign: "center"
  },
  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "15px",
    background: "#fbbf24", // لون ذهبي
    color: "#1e1b4b", // لون كحلي للنص
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(251, 191, 36, 0.3)"
  },
  backButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "15px",
    background: "transparent",
    color: "#ccc",
    border: "1px solid #444",
    marginTop: 15,
    cursor: "pointer",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    cursor: "pointer",
    fontSize: "20px"
  },
  errorBox: {
    color: "#fff",
    background: "#ef4444",
    padding: "10px",
    borderRadius: 10,


















    marginBottom: 15,
    fontSize: "14px"
  },
};