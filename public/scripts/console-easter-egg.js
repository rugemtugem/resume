// public/scripts/console-easter-egg.js

window.coder = {
    name: 'Fábio Soares',
    nickname: 'Ferrugem',
    role: 'Tech Lead em Front-end & Produtos Digitais',
    location: 'São Paulo - SP',

    contact: {
        email: 'contato@rugemtugem.dev',
        phone: '+55 11 9 8651-4401',
        whatsapp: 'https://wa.me/5511986514401',
        website: 'https://rugemtugem.dev',
        linkedin: 'https://linkedin.com/in/rugemtugem'
    },

    skills: [
        'React', 'Next.js', 'TypeScript', 'UX/UI Design', 'IA Aplicada',
        'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'WordPress', 'Figma'
    ],

    hardWorker: true,
    quickLearner: true,
    problemSolver: true,

    // Método principal que exibe tudo
    hireable: function () {
        const isHireable = this.hardWorker && this.problemSolver && this.skills.length >= 5;

        // Exibe perfil formatado
        console.log('\n%c═══════════════════════════════════════════════════', 'color: #E94560');
        console.log('%c   👨‍💻 FÁBIO SOARES - TECH LEAD FRONT-END', 'color: #E94560; font-size: 18px; font-weight: bold');
        console.log('%c═══════════════════════════════════════════════════\n', 'color: #E94560');

        console.log('%c📋 Perfil:', 'color: #E94560; font-weight: bold');
        console.log(`   Nome: ${this.name} (${this.nickname})`);
        console.log(`   Cargo: ${this.role}`);
        console.log(`   Localização: ${this.location}\n`);

        console.log('%c📬 Contato:', 'color: #E94560; font-weight: bold');
        console.log(`   📧 ${this.contact.email}`);
        console.log(`   📱 ${this.contact.phone}`);
        console.log(`   💬 ${this.contact.whatsapp}`);
        console.log(`   🌐 ${this.contact.website}`);
        console.log(`   💼 ${this.contact.linkedin}\n`);

        console.log('%c🛠️  Skills:', 'color: #E94560; font-weight: bold');
        console.log(`   ${this.skills.join(' • ')}\n`);

        console.log('%c✨ Atributos:', 'color: #E94560; font-weight: bold');
        console.log(`   Hard Worker: ${this.hardWorker ? '✓' : '✗'}`);
        console.log(`   Quick Learner: ${this.quickLearner ? '✓' : '✗'}`);
        console.log(`   Problem Solver: ${this.problemSolver ? '✓' : '✗'}\n`);

        console.log('%c🎯 Disponível para Contratação:', 'color: #E94560; font-weight: bold; font-size: 14px');
        console.log(`%c   ${isHireable ? '✓ SIM!' : '✗ Não'}`, `color: ${isHireable ? '#4ADE80' : '#EF4444'}; font-size: 16px; font-weight: bold`);

        console.log('\n%c═══════════════════════════════════════════════════\n', 'color: #E94560');

        return isHireable;
    }
};

// Mensagem inicial (aparece automaticamente quando abrem o console)
console.log('%c🎯 Psiu! Você é curioso...', 'font-size: 16px; color: #E94560; font-weight: bold');
console.log('%cTeste este comando no console: %ccoder.hireable()', 'color: #A0AEC0', 'color: #60A5FA; font-weight: bold; background: rgba(96, 165, 250, 0.1); padding: 2px 8px');
console.log('');