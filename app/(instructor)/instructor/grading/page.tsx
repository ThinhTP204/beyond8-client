"use client"

import { GradingExplorer } from "./components/GradingExplorer"

export default function GradingPage() {
    return (
        <div className="flex flex-col h-full scrollbar-stable" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <h1 className="text-2xl font-bold mb-6">Chấm bài tập</h1>
            <GradingExplorer />
        </div>
    )
}
