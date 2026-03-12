// components/sections/partnership/contact-partnership.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/language-provider';
import { translations } from '@/data/translations';
import { useToast } from '@/components/ui/toast';
import { PrimaryButton } from '@/components/ui/buttons/primary-button';
import { IconButton } from '@/components/ui/buttons/icon-button';
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
    Sparkles,
    Calendar,
    FileText,
    MessageCircle,
    ArrowRight,
    Instagram
} from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
    email: z.string().email('Email inválido'),
    whatsapp: z.string().min(10, 'WhatsApp inválido').optional().or(z.literal('')),
    message: z.string().min(10, 'Mensagem muito curta').max(1000, 'Mensagem muito longa'),
});

type ContactFormData = z.infer<typeof formSchema>;

export function ContactPartnership() {
    const { language } = useLanguage();
    const t = translations[language];
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

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
            showToast({
                type: 'success',
                title: `✅ ${t.contact.success}`,
                duration: 5000,
            });

            reset();
            setTimeout(() => setSubmitSuccess(false), 5000);
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

    const contactInfo = useMemo(() => [
        {
            icon: Mail,
            label: 'Email',
            value: personalInfo.email,
            href: `mailto:${personalInfo.email}`,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            icon: Phone,
            label: 'WhatsApp',
            value: personalInfo.phone,
            href: `https://wa.me/${personalInfo.phone.replace(/\D/g, '')}`,
            color: 'from-green-500 to-emerald-600',
        },
    ], []);

    const socialLinks = useMemo(() => [
        {
            icon: Github,
            label: 'GitHub',
            href: personalInfo.github,
            color: 'hover:text-[var(--primary-color)]',
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            href: personalInfo.linkedin,
            color: 'hover:text-[var(--primary-color)]',
        },
        {
            icon: Instagram,
            label: 'Instagram',
            href: t.contact.instagram,
            color: 'hover:text-[var(--primary-color)]',
        },
    ], [t.contact.instagram]);

    const getInputBorderClass = (fieldName: keyof ContactFormData) => {
        if (errors[fieldName]) return 'border-red-500/50';
        if (touchedFields[fieldName] && watchedFields[fieldName]) return 'border-[var(--primary-color)]/50';
        return 'border-[var(--border-color)]';
    };

    return (
        <section id="contact" className="py-24 px-4 md:px-8 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        {t.contact.title.split('?')[0]}? <span className="text-gradient-neon">{t.contact.title.split('?')[1]}</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                        {t.contact.description}
                    </p>
                </motion.div>

                {/* Partnership Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {language === 'pt' ? 'Consulta Estratégica' : 'Strategic Consultation'} (30min)
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            {language === 'pt' ? 'Análise gratuita do seu desafio e roadmap de soluções.' : 'Free analysis of your challenge and solution roadmap.'}
                        </p>
                        <a href={`https://wa.me/${personalInfo.phone.replace(/\D/g, '')}`} target="_blank" className="text-[var(--primary-color)] font-semibold hover:underline flex items-center gap-2">
                            {language === 'pt' ? 'Agendar agora' : 'Book now'} <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {language === 'pt' ? 'Proposta Customizada' : 'Custom Proposal'}
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            {language === 'pt' ? 'Plano detalhado com investimento e resultados esperados.' : 'Detailed plan with investment and expected results.'}
                        </p>
                        <a href="#contact-form" className="text-[var(--primary-color)] font-semibold hover:underline flex items-center gap-2">
                            {language === 'pt' ? 'Solicitar proposta' : 'Request proposal'} <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {language === 'pt' ? 'Bate-papo Informal' : 'Informal Chat'}
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                            {language === 'pt' ? 'WhatsApp direto para tirar dúvidas ou explorar ideias.' : 'Direct WhatsApp to answer questions or explore ideas.'}
                        </p>
                        <a href={`https://wa.me/${personalInfo.phone.replace(/\D/g, '')}`} target="_blank" className="text-[var(--primary-color)] font-semibold hover:underline flex items-center gap-2">
                            {language === 'pt' ? 'Iniciar conversa' : 'Start conversation'} <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>

                {/* Form and Info Section */}
                <div id="contact-form" className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3 p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--primary-color)]/5 to-transparent rounded-tr-3xl" />
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-[var(--primary-color)]" />
                                        {t.contact.name}
                                    </label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        placeholder={language === 'pt' ? 'Nome completo' : 'Full name'}
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 ${getInputBorderClass('name')}`}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[var(--primary-color)]" />
                                        {t.contact.whatsapp}
                                    </label>
                                    <input
                                        {...register('whatsapp')}
                                        type="tel"
                                        placeholder="+55 11 9 9999-9999"
                                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 ${getInputBorderClass('whatsapp')}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                    <AtSign className="w-4 h-4 text-[var(--primary-color)]" />
                                    {t.contact.email}
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="seu@email.com"
                                    className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 ${getInputBorderClass('email')}`}
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[var(--primary-color)]" />
                                    {t.contact.message}
                                </label>
                                <textarea
                                    {...register('message')}
                                    rows={4}
                                    placeholder={language === 'pt' ? 'Como posso ajudar seu negócio hoje?' : 'How can I help your business today?'}
                                    className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 resize-none ${getInputBorderClass('message')}`}
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                            </div>

                            <PrimaryButton
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting || submitSuccess}
                                className="w-full py-4 text-lg"
                                leftIcon={submitSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                            >
                                {isSubmitting ? t.contact.sending : submitSuccess ? (language === 'pt' ? 'Enviado!' : 'Sent!') : t.contact.send}
                            </PrimaryButton>
                        </form>
                    </motion.div>

                    {/* Right: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="space-y-4">
                            {contactInfo.map((info, idx) => (
                                <a
                                    key={idx}
                                    href={info.href}
                                    target="_blank"
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all group"
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} text-white group-hover:scale-110 transition-transform`}>
                                        <info.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">{info.label}</p>
                                        <p className="text-sm font-medium text-[var(--text-primary)]">{info.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 border border-[var(--primary-color)]/10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-[var(--primary-color)]" />
                                <h4 className="font-bold text-[var(--text-primary)]">{t.contact.followMe}</h4>
                            </div>
                            <div className="flex gap-4">
                                {socialLinks.map((social, idx) => (
                                    <IconButton
                                        key={idx}
                                        icon={<social.icon className="w-5 h-5" />}
                                        href={social.href}
                                        tooltip={social.label}
                                        ariaLabel={social.label}
                                        variant="outline"
                                        className={social.color}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20">
                            <h4 className="text-lg font-bold mb-2">💡 {language === 'pt' ? 'Dica Estratégica' : 'Strategic Tip'}</h4>
                            <p className="text-sm text-white/90 leading-relaxed">
                                {language === 'pt' 
                                    ? 'A maioria dos nossos projetos começa com um simples "olá". Não espere o momento perfeito para planejar sua escala.'
                                    : 'Most of our projects start with a simple "hello". Don\'t wait for the perfect moment to plan your scale.'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
