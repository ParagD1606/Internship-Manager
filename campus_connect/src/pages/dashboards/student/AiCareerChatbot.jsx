import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AiCareerChatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your AI Career Counselor. Ask me anything about career paths, skills, or resume tips!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        
        // Add User Message to UI
        const newHistory = [...messages, { role: 'user', text: userMsg }];
        setMessages(newHistory);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // We send the last 6 messages as history context
            const historyContext = newHistory.slice(-6); 

            const res = await axios.post('http://127.0.0.1:8080/api/ai-chatbot/ask', 
                { message: userMsg, history: historyContext }, 
                { headers: { 'x-auth-token': token } }
            );

            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Sparkles size={24} color="#4f46e5" />
                <h1 style={styles.title}>Career Assistant</h1>
            </div>

            <div style={styles.chatBox}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        ...styles.msgRow, 
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        {msg.role === 'ai' && (
                            <div style={styles.avatar}>
                                <Bot size={20} color="white" />
                            </div>
                        )}
                        
                        <div style={{
                            ...styles.bubble,
                            background: msg.role === 'user' ? '#4f46e5' : 'white',
                            color: msg.role === 'user' ? 'white' : '#1e293b',
                            border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0'
                        }}>
                            {msg.text}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{...styles.avatar, background:'#94a3b8'}}>
                                <User size={20} color="white" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div style={{padding:'10px', fontSize:'0.9rem', color:'#64748b'}}>Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={styles.inputArea}>
                <input 
                    style={styles.input} 
                    placeholder="Ask about careers..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" style={styles.sendBtn} disabled={loading}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '500px', // Smaller width like a phone/widget
        height: '600px', 
        margin: '20px auto', 
        background: '#f8fafc', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: { 
        padding: '20px', 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px'
    },
    title: { fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#1e293b' },
    
    chatBox: { 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
    },
    msgRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
    avatar: { 
        width: '32px', height: '32px', borderRadius: '50%', 
        background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' 
    },
    bubble: { 
        padding: '12px 16px', 
        maxWidth: '80%', 
        fontSize: '0.95rem', 
        lineHeight: '1.5',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    
    inputArea: { 
        padding: '15px', 
        background: 'white', 
        borderTop: '1px solid #e2e8f0', 
        display: 'flex', 
        gap: '10px' 
    },
    input: { 
        flex: 1, 
        padding: '12px', 
        borderRadius: '20px', 
        border: '1px solid #cbd5e1', 
        outline: 'none',
        fontSize: '0.95rem'
    },
    sendBtn: { 
        width: '45px', 
        height: '45px', 
        borderRadius: '50%', 
        background: '#0f172a', 
        color: 'white', 
        border: 'none', 
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }
};

export default AiCareerChatbot;