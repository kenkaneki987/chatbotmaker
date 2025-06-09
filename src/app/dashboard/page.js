"use client"
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/auth'
import './dashboard.css'
import { createChatbot } from '@/services/chatbot'
import { getToken } from '@/helpers/auth'
const Dashboard = () => {
    const router = useRouter()
    const { isLoggedIn, logout } = useContext(AuthContext)
    const [chatbots, setChatbots] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        context: ''
    })
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleCreateChatbot = async () => {
        if (!formData.name.trim() || !formData.context.trim()) {
            alert('Please fill in all fields')
            return
        }
        const newChatbot = {
            id: Date.now(),
            name: formData.name,
            context: formData.context,
            createdAt: new Date().toISOString()
        }
        setChatbots([...chatbots, newChatbot]);
        await createChatbot({ name: formData.name, context: formData.context, token: getToken() })
        setFormData({ name: '', context: '' })
    }
    const handleOpenChat = (chatbot) => {
        const encodedName = encodeURIComponent(chatbot.name)
        router.push(`/chatbot/${encodedName}`)
    }
    if (!isLoggedIn) {
        return (
            <div className="notLoggedIn">
                <h1>Not Logged In</h1>
                <p>Please log in to access the dashboard</p>
            </div>
        )
    } else {
        return (
            <div className="dashboard">
                <div className="dashboardHeader">
                    <h1>Dashboard</h1>
                </div>
                <div className="dashboardContent">
                    <div className="createChatbotSection">
                        <h2>Create New Chatbot</h2>
                        <div className="inputGroup">
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter chatbot name"
                                className="chatbotName"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="context"
                                placeholder="Enter chatbot context"
                                className="chatbotContext"
                                value={formData.context}
                                onChange={handleChange}
                            />
                            <button onClick={handleCreateChatbot} className="createChatbotButton">
                                Create Chatbot
                            </button>
                        </div>
                    </div>
                    <div className="chatbotsList">
                        <h2>Your Chatbots</h2>
                        {chatbots.length === 0 ? (
                            <p className="noChatbots">No chatbots created yet</p>
                        ) : (
                            <div className="chatbotGrid">
                                {chatbots.map(chatbot => (
                                    <div key={chatbot.id} className="chatbotCard">
                                        <h3>{chatbot.name}</h3>
                                        <p className="context">{chatbot.context}</p>
                                        <p className="createdAt">
                                            Created: {new Date(chatbot.createdAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => handleOpenChat(chatbot)}
                                            className="openChatButton"
                                        >
                                            Open Chat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboard