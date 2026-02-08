'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Toast variant types */
type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Individual toast data */
interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

/** Toast context interface */
interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
};

const colorClasses: Record<ToastType, string> = {
    success: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-500/20',
    error: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-500/20',
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500/20',
    warning: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/20',
};

/**
 * ToastProvider Component
 *
 * Context provider for the toast notification system.
 * Wrap your app with this to enable `useToast()` anywhere.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <ToastProvider>{children}</ToastProvider>
 *
 * // In any component
 * const { showToast } = useToast();
 * showToast({ type: 'success', title: 'Sucesso!', message: 'Mensagem enviada' });
 * ```
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (toast: Omit<Toast, 'id'>) => {
            const id = Date.now().toString();
            const duration = toast.duration || 3000;

            setToasts((prev) => [...prev, { ...toast, id }]);

            setTimeout(() => {
                hideToast(id);
            }, duration);
        },
        [hideToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {/* Toast container — top-right */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={cn(
                                colorClasses[toast.type],
                                'min-w-[300px] max-w-md',
                                'px-4 py-3 rounded-xl',
                                'shadow-xl border',
                                'backdrop-blur-md',
                                'pointer-events-auto'
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[var(--text-primary)]">
                                        {toast.title}
                                    </p>
                                    {toast.message && (
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            {toast.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => hideToast(toast.id)}
                                    className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                    aria-label="Fechar notificação"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/**
 * Hook to access the toast notification system.
 * Must be used within a ToastProvider.
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
