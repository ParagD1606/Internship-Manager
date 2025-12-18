import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, Play, RefreshCw, Star, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const TOPICS = ["Java", "Python", "React.js", "JavaScript", "Data Structures", "Behavioral (HR)", "SQL", "Node.js"];

const AiMockInterviewer = () => {
    const [topic, setTopic] = useState(TOPICS[0]);
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startInterview = async () => {
        setStarted(true);
        setLoading(true);
        // Clean start
        setMessages([{ role: 'system', text: `Initializing AI Interviewer for ${topic}...` }]);

        try {
            const token = localStorage.getItem('token');
            // ✅ Port 8080 use ho raha hai, ensure backend is running there
            const res = await axios.post('http://localhost:8080/api/ai-interview/chat', 
                { topic, currentQuestion: null }, 
                { headers: { 'x-auth-token': token } }
            );

            const aiData = res.data;
            setMessages(prev => [...prev, { role: 'ai', text: aiData.nextQuestion }]);
            setCurrentQuestion(aiData.nextQuestion);
        } catch (err) {
            console.error("API Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Server connection failed (500)");
            setStarted(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if(!input.trim() || loading) return;

        const userAns = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userAns }]);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8080/api/ai-interview/chat', 
                { topic, currentQuestion, userAnswer: userAns }, 
                { headers: { 'x-auth-token': token } }
            );

            const aiData = res.data;
            
            setMessages(prev => [
                ...prev, 
                { 
                    role: 'feedback', 
                    text: `Assessment (Score: ${aiData.rating}/10): ${aiData.feedback}`, 
                    rating: aiData.rating 
                },
                { role: 'ai', text: aiData.nextQuestion }
            ]);
            
            setCurrentQuestion(aiData.nextQuestion);
        } catch (err) {
            toast.error("AI node is busy. Try again.");
            console.error("Chat Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            {/* Header Section */}
            <div style={styles.header}>
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <div style={styles.iconCircle}><Sparkles color="white" size={24}/></div>
                    <div>
                        <h1 style={styles.title}>AI Mock Interview</h1>
                        <p style={styles.subtitle}>Real-time technical assessment powered by AI</p>
                    </div>
                </div>

                {!started ? (
                    <div style={styles.controls}>
                        <select style={styles.select} value={topic} onChange={e => setTopic(e.target.value)}>
                            {TOPICS.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <button onClick={startInterview} style={styles.startBtn}>
                            <Play size={18} fill="currentColor"/> Start Session
                        </button>
                    </div>
                ) : (
                    <button onClick={() => window.location.reload()} style={styles.restartBtn}>
                        <RefreshCw size={16}/> End Session
                    </button>
                )}
            </div>

            {/* Chat Interface */}
            <div style={styles.chatWrapper}>
                <div style={styles.chatBox} className="custom-scrollbar">
                    {!started && (
                        <div style={styles.placeholder}>
                            <Bot size={80} color="#e2e8f0" style={{marginBottom:'20px'}}/>
                            <h2 style={{color:'#1e293b', marginBottom:'8px'}}>Ready to practice?</h2>
                            <p style={{color:'#64748b'}}>Choose your domain and let's begin your technical round.</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            ...styles.msgRow, 
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            {msg.role !== 'user' && msg.role !== 'system' && (
                                <div style={{
                                    ...styles.avatar, 
                                    background: msg.role === 'feedback' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                }}>
                                    {msg.role === 'feedback' ? <Star size={14} color="white" fill="white"/> : <Bot size={18} color="white"/>}
                                </div>
                            )}

                            <div style={{
                                ...styles.bubble,
                                background: msg.role === 'user' ? '#4f46e5' : msg.role === 'feedback' ? '#fffbeb' : '#ffffff',
                                color: msg.role === 'user' ? 'white' : msg.role === 'feedback' ? '#b45309' : '#334155',
                                border: msg.role === 'feedback' ? '1px solid #fcd34d' : '1px solid #f1f5f9',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                {msg.role === 'system' ? <span style={{fontSize:'12px', opacity:0.7}}>— {msg.text} —</span> : msg.text}
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div style={{display:'flex', gap:'10px', alignItems:'center', padding:'10px'}}>
                            <div className="typing-dot"></div>
                            <span style={{fontSize:'12px', color:'#94a3b8', fontWeight:'bold'}}>AI ANALYZING...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Control */}
                {started && (
                    <form onSubmit={handleSend} style={styles.inputArea}>
                        <div style={styles.inputShadow}>
                            <input 
                                style={styles.input} 
                                placeholder="State your technical answer..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
                                <Send size={20}/>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// ... (Styles section update for modern look)
const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', height:'90vh', display:'flex', flexDirection:'column' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding:'0 10px' },
    iconCircle: { width:'50px', height:'50px', borderRadius:'15px', background:'linear-gradient(135deg, #6366f1, #a855f7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 10px 20px rgba(99,102,241,0.2)' },
    title: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin:0, letterSpacing:'-0.5px' },
    subtitle: { color: '#64748b', fontSize:'14px', fontWeight:'500' },
    
    controls: { display:'flex', gap:'12px', background:'white', padding:'6px', borderRadius:'14px', border:'1px solid #e2e8f0' },
    select: { border:'none', padding:'0 15px', fontSize:'14px', fontWeight:'600', outline:'none', background:'transparent', cursor:'pointer' },
    startBtn: { background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', transition:'0.2s' },
    
    chatWrapper: { flex: 1, display:'flex', flexDirection:'column', gap:'20px', minHeight:0 },
    chatBox: { flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', overflowY: 'auto', padding: '30px', display:'flex', flexDirection:'column', gap:'20px' },
    placeholder: { height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' },

    msgRow: { display: 'flex', alignItems: 'flex-start', gap: '12px', width:'100%' },
    avatar: { width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop:'4px' },
    bubble: { padding: '16px 20px', borderRadius: '18px', fontSize: '0.95rem', lineHeight: '1.6', maxWidth:'75%' },

    inputArea: { width: '100%' },
    inputShadow: { display: 'flex', background:'white', borderRadius:'20px', padding:'8px', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)', border:'1px solid #e2e8f0' },
    input: { flex: 1, padding: '12px 20px', border: 'none', fontSize: '1rem', outline: 'none', background:'transparent' },
    sendBtn: { background: '#0f172a', color: 'white', border: 'none', padding: '0 25px', borderRadius: '15px', cursor: 'pointer', transition:'0.2s' }
};

export default AiMockInterviewer;