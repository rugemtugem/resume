'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/components/language-provider';
import { translations } from '@/data/translations';
import { useToast } from '@/components/ui/toast';
import { PrimaryButton } from '@/components/ui/buttons/primary-button';
import { IconButton } from '@/components/ui/buttons/icon-button';
import { Confetti } from '@/components/effects/confetti';
import { personalInfo } from '@/data/resume-data';
import {
    Send,
    Mail,
    Phone,
    MapPin,
    Github,
    Linkedin,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MessageSquare,
    User,
    AtSign,
    Sparkles
} from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
    email: z.string().email('Email inválido'),
    whatsapp: z.string().min(10, 'WhatsApp inválido').optional().or(z.literal('')),
    message: z.string().min(10, 'Mensagem muito curta').max(1000, 'Mensagem muito longa'),
});

type ContactFormData = z.infer<typeof formSchema>;

/**
 * ContactSection Component — Premium
 *
 * Contact form with real-time Zod validation, glassmorphism design,
 * gradient contact cards, animated feedback icons, and confetti celebration.
 */
export function ContactSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        reset,
        watch,
    } = useForm<ContactFormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    const watchedFields = watch();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, to: personalInfo.email }),
            });

            if (!response.ok) throw new Error('Erro ao enviar');

            setSubmitSuccess(true);
            setShowConfetti(true);

            showToast({
                type: 'success',
                title: `✅ ${t.contact.success}`,
                duration: 5000,
            });

            reset();

            setTimeout(() => {
                setShowConfetti(false);
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            showToast({
                type: 'error',
                title: `❌ ${t.contact.error}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /** Memoized contact information with gradient colors */
    const contactInfo = useMemo(() => [
        {
            icon: Mail,
            label: 'Email',
            value: personalInfo.email,
            href: `mailto:${personalInfo.email}`,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Phone,
            label: 'WhatsApp',
            value: personalInfo.phone,
            href: `https://wa.me/${personalInfo.phone.replace(/\D/g, '')}`,
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: MapPin,
            label: language === 'pt' ? 'Localização' : 'Location',
            value: personalInfo.location,
            href: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`,
            color: 'from-red-500 to-orange-500',
        },
    ], [language]);

    /** Memoized social links */
    const socialLinks = useMemo(() => [
        {
            icon: Github,
            label: 'GitHub',
            href: personalInfo.github,
            color: 'hover:text-purple-500',
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            href: personalInfo.linkedin,
            color: 'hover:text-blue-500',
        },
    ], []);

    /** Helper: get input border class based on validation state */
    const getInputBorderClass = (fieldName: keyof ContactFormData) => {
        if (errors[fieldName]) return 'border-red-500/50';
        if (touchedFields[fieldName] && watchedFields[fieldName]) return 'border-green-500/50';
        return 'border-[var(--border-color)]';
    };

    return (
        <>
            <section id="contact" className="relative py-20 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-color)]/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--secondary-color)]/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 mb-4"
                            >
                                <MessageSquare className="w-4 h-4 text-[var(--primary-color)]" />
                                <span className="text-sm font-medium text-[var(--primary-color)]">
                                    {t.contact.subtitle}
                                </span>
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-neon">
                                {t.contact.title}
                            </h2>

                            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                                {t.contact.description}
                            </p>
                        </div>

                        {/* Main Content */}
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Form Column */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative p-8 rounded-2xl bg-[var(--bg-primary)]/80 backdrop-blur-lg border border-[var(--border-color)] shadow-xl">
                                        {/* Decorative Corner */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--primary-color)]/10 to-transparent rounded-tr-2xl pointer-events-none" />

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                                            {/* Name Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-[var(--primary-color)]" />
                                                    {t.contact.name}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        {...register('name')}
                                                        type="text"
                                                        placeholder={language === 'pt' ? 'Seu nome completo' : 'Your full name'}
                                                        className={`
                              w-full px-4 py-3 rounded-lg
                              bg-[var(--bg-secondary)]
                              border-2 transition-all duration-300
                              text-[var(--text-primary)]
                              placeholder:text-[var(--text-secondary)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50
                              ${getInputBorderClass('name')}
                            `}
                                                    />
                                                    <AnimatePresence>
                                                        {touchedFields.name && !errors.name && watchedFields.name && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                exit={{ scale: 0 }}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <AnimatePresence>
                                                    {errors.name && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.name.message}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Email & WhatsApp Row */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {/* Email */}
                                                <div>
                                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                                        <AtSign className="w-4 h-4 text-[var(--primary-color)]" />
                                                        {t.contact.email}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            {...register('email')}
                                                            type="email"
                                                            placeholder="seu@email.com"
                                                            className={`
                                w-full px-4 py-3 rounded-lg
                                bg-[var(--bg-secondary)]
                                border-2 transition-all duration-300
                                text-[var(--text-primary)]
                                placeholder:text-[var(--text-secondary)]
                                focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50
                                ${getInputBorderClass('email')}
                              `}
                                                        />
                                                        <AnimatePresence>
                                                            {touchedFields.email && !errors.email && watchedFields.email && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <AnimatePresence>
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="mt-1 text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-3 h-3" />
                                                                {errors.email.message}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* WhatsApp */}
                                                <div>
                                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-[var(--primary-color)]" />
                                                        {t.contact.whatsapp}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            {...register('whatsapp')}
                                                            type="tel"
                                                            placeholder="+55 11 9 1234-5678"
                                                            className={`
                                w-full px-4 py-3 rounded-lg
                                bg-[var(--bg-secondary)]
                                border-2 transition-all duration-300
                                text-[var(--text-primary)]
                                placeholder:text-[var(--text-secondary)]
                                focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50
                                ${getInputBorderClass('whatsapp')}
                              `}
                                                        />
                                                        <AnimatePresence>
                                                            {touchedFields.whatsapp && !errors.whatsapp && watchedFields.whatsapp && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <AnimatePresence>
                                                        {errors.whatsapp && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="mt-1 text-sm text-red-500 flex items-center gap-1"
                                                            >
                                                                <AlertCircle className="w-3 h-3" />
                                                                {errors.whatsapp.message}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            {/* Message Textarea */}
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4 text-[var(--primary-color)]" />
                                                    {t.contact.message}
                                                </label>
                                                <div className="relative">
                                                    <textarea
                                                        {...register('message')}
                                                        rows={5}
                                                        placeholder={language === 'pt'
                                                            ? 'Conte-me sobre seu projeto ou dúvida...'
                                                            : 'Tell me about your project or question...'
                                                        }
                                                        className={`
                              w-full px-4 py-3 rounded-lg resize-none
                              bg-[var(--bg-secondary)]
                              border-2 transition-all duration-300
                              text-[var(--text-primary)]
                              placeholder:text-[var(--text-secondary)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50
                              ${getInputBorderClass('message')}
                            `}
                                                    />
                                                    <div className="absolute bottom-3 right-3 text-xs text-[var(--text-secondary)]">
                                                        {watchedFields.message?.length || 0} / 1000
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {errors.message && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                                                        >
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.message.message}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Submit Button */}
                                            <PrimaryButton
                                                type="submit"
                                                loading={isSubmitting}
                                                disabled={isSubmitting || submitSuccess}
                                                leftIcon={
                                                    submitSuccess
                                                        ? <CheckCircle2 className="w-5 h-5" />
                                                        : isSubmitting
                                                            ? <Loader2 className="w-5 h-5 animate-spin" />
                                                            : <Send className="w-5 h-5" />
                                                }
                                                fullWidth
                                                size="lg"
                                            >
                                                {isSubmitting
                                                    ? t.contact.sending
                                                    : submitSuccess
                                                        ? (language === 'pt' ? 'Enviado!' : 'Sent!')
                                                        : t.contact.send
                                                }
                                            </PrimaryButton>
                                        </form>
                                    </div>
                                </motion.div>

                                {/* Info Column */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    {/* Contact Info Cards */}
                                    <div className="space-y-4">
                                        {contactInfo.map((info, index) => {
                                            const Icon = info.icon;
                                            return (
                                                <motion.a
                                                    key={info.label}
                                                    href={info.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    viewport={{ once: true }}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    className="flex items-center gap-4 p-5 rounded-xl bg-[var(--bg-primary)]/80 backdrop-blur-lg border border-[var(--border-color)] shadow-lg group hover:shadow-xl transition-all block"
                                                >
                                                    <div className={`
                            p-3 rounded-lg bg-gradient-to-br ${info.color}
                            group-hover:scale-110 transition-transform
                          `}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                                                            {info.label}
                                                        </div>
                                                        <div className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors">
                                                            {info.value}
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            );
                                        })}
                                    </div>

                                    {/* Social Links */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        viewport={{ once: true }}
                                        className="p-6 rounded-xl bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 border border-[var(--border-color)]"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <Sparkles className="w-5 h-5 text-[var(--primary-color)]" />
                                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                                {t.contact.followMe}
                                            </h3>
                                        </div>

                                        <div className="flex gap-3 justify-start">
                                            {socialLinks.map((social) => {
                                                const Icon = social.icon;
                                                return (
                                                    <IconButton
                                                        key={social.label}
                                                        icon={<Icon className="w-5 h-5" />}
                                                        href={social.href}
                                                        ariaLabel={social.label}
                                                        variant="outline"
                                                        size="lg"
                                                        tooltip={social.label}
                                                        className={`w-[50px] h-[50px] ${social.color}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </motion.div>

                                    {/* CTA Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        viewport={{ once: true }}
                                        className="p-6 rounded-xl bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 border border-[var(--primary-color)]/20"
                                    >
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                            {language === 'pt'
                                                ? '💡 Vamos criar algo incrível juntos?'
                                                : "💡 Let's create something amazing together?"
                                            }
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                            {language === 'pt'
                                                ? 'Estou sempre aberto a novas oportunidades, colaborações e projetos desafiadores. Entre em contato!'
                                                : "I'm always open to new opportunities, collaborations and challenging projects. Get in touch!"
                                            }
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Confetti effect on successful form submission */}
            <Confetti trigger={showConfetti} />
        </>
    );
}
