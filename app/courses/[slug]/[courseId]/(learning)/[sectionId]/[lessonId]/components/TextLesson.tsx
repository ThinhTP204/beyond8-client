'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TextLessonProps {
    title: string
    content: string | null
}

export default function TextLesson({ title, content }: TextLessonProps) {
    if (!content) return null

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    {title}
                </h1>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-4">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <p className="text-white/70 text-base leading-relaxed mb-4 break-words">{children}</p>,
                            h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-5 mb-2">{children}</h3>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-white/80">{children}</em>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-white/70 mb-4 ml-4 break-words">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-white/70 mb-4 ml-4 break-words">{children}</ol>,
                            li: ({ children }) => <li className="text-white/70 break-words">{children}</li>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-purple/50 pl-4 italic text-white/60 my-4">{children}</blockquote>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-pink hover:underline">{children}</a>,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            code: ({ inline, className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        {...props}
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg !bg-[#1e1e1e] !p-4 my-4 border border-white/10 text-sm shadow-xl overflow-x-auto"
                                        showLineNumbers={false}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className="bg-white/10 text-brand-pink px-1.5 py-0.5 rounded text-sm font-mono break-all" {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
