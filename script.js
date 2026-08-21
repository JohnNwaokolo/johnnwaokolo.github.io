const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => siteNav.classList.remove('open'));
    });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

async function loadProjects() {
    const container = document.querySelector('[data-projects]');
    if (!container) return;

    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Projects unavailable');
        const projects = await response.json();
        container.innerHTML = projects.map((project, index) => `
            <article class="project-card reveal ${index === 0 ? 'featured' : ''}">
                <img class="project-image" src="${project.image}" alt="${project.title} project preview" loading="lazy">
                <div class="project-body">
                    <span class="project-meta">${project.label}</span>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tags">${project.stack.map((item) => `<span>${item}</span>`).join('')}</div>
                    <div class="project-links">
                        <a href="${project.live}" target="_blank" rel="noopener noreferrer">View project <span aria-hidden="true">↗</span></a>
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer">Source <span aria-hidden="true">↗</span></a>
                    </div>
                </div>
            </article>
        `).join('');
        container.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    } catch (error) {
        container.innerHTML = '<p class="prose">Projects are temporarily unavailable. Visit <a class="inline-link" href="https://github.com/JohnNwaokolo">GitHub</a> to browse the work.</p>';
    }
}

loadProjects();

async function loadResume() {
    const container = document.querySelector('[data-resume]');
    if (!container) return;

    try {
        const [resumeResponse, projectsResponse, certificationsResponse] = await Promise.all([
            fetch('data/resume-data.json'),
            fetch('data/projects.json'),
            fetch('data/certifications.json')
        ]);
        if (!resumeResponse.ok || !projectsResponse.ok || !certificationsResponse.ok) throw new Error('Resume data unavailable');
        const resume = await resumeResponse.json();
        const projects = await projectsResponse.json();
        const certifications = await certificationsResponse.json();
        const contactLinks = resume.links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('<span aria-hidden="true">|</span>');
        const skillGroups = Object.entries(resume.skills).map(([group, skills]) => `<div class="resume-skill-group"><h3>${group}</h3><p>${skills.join(' · ')}</p></div>`).join('');
        const experience = resume.experience.map((entry) => `<article class="resume-entry"><div class="resume-entry-heading"><h3>${entry.role}</h3><span class="resume-period">${entry.period}</span></div><div class="resume-entry-company">${entry.company}</div><p>${entry.details}</p></article>`).join('');
        const selectedProjects = projects.slice(0, 4).map((project) => `<article class="resume-project"><span class="resume-project-meta">${project.label}</span><h3><a href="${project.live}" target="_blank" rel="noopener noreferrer">${project.title}</a></h3><p>${project.description}</p></article>`).join('');
        const education = resume.education.map((entry) => `<article class="resume-education"><h3>${entry.title}</h3><p>${entry.institution} · ${entry.period}</p></article>`).join('');
        const certificates = certifications.slice(0, 4).map((certification) => `<li>${certification.name} <span>${certification.issuer} / ${certification.date}</span></li>`).join('');

        container.innerHTML = `<header class="resume-header"><h1>${resume.name}</h1><p class="resume-headline">${resume.headline}</p><div class="resume-contact"><span>${resume.location}</span>${contactLinks}</div></header><div class="resume-layout"><div><section class="resume-section"><h2>Profile</h2><p class="resume-summary">${resume.summary}</p></section><section class="resume-section"><h2>Experience</h2>${experience}</section><section class="resume-section"><h2>Selected projects</h2>${selectedProjects}</section></div><aside><section class="resume-section"><h2>Technical skills</h2>${skillGroups}</section><section class="resume-section"><h2>Education</h2>${education}</section><section class="resume-section"><h2>Certifications</h2><ul class="resume-cert-list">${certificates}</ul></section></aside></div>`;
    } catch (error) {
        container.innerHTML = '<p class="resume-loading">The résumé could not be loaded. Return to the <a class="inline-link" href="index.html">portfolio</a> and try again.</p>';
    }
}

loadResume();

const printResume = document.querySelector('[data-print-resume]');
if (printResume) printResume.addEventListener('click', () => window.print());

if (!document.body.classList.contains('resume-site')) {
    const assistantMarkup = `<aside class="site-assistant" aria-label="Ask John"><div class="assistant-panel" id="assistant-panel" hidden><div class="assistant-header"><div><p class="assistant-kicker">John's Guide</p><h2>How can I help?</h2></div><button class="assistant-close" type="button" aria-label="Close Ask John">×</button></div><div class="assistant-messages" aria-live="polite" aria-label="Guide messages"><p class="assistant-message assistant-message-bot">I can point you to John's work, explain the direction behind JDH Studio, or help you start a conversation.</p></div><div class="assistant-prompts" aria-label="Suggested questions"><button type="button" data-assistant-question="What has John built?">Selected work</button><button type="button" data-assistant-question="What is JDH Studio?">JDH Studio</button><button type="button" data-assistant-question="How can I collaborate?">Start a conversation</button></div><form class="assistant-form"><label class="sr-only" for="assistant-input">Ask John a question</label><input id="assistant-input" name="question" autocomplete="off" placeholder="Ask a question..." required><button type="submit" aria-label="Send question">↑</button></form><p class="assistant-note">A focused guide to John's portfolio, not a human representative.</p></div><button class="assistant-toggle" type="button" aria-expanded="false" aria-controls="assistant-panel"><span class="assistant-toggle-mark" aria-hidden="true">✦</span><span>Ask John</span></button></aside>`;
    document.body.insertAdjacentHTML('beforeend', assistantMarkup);

    const assistant = document.querySelector('.site-assistant');
    const assistantPanel = assistant.querySelector('.assistant-panel');
    const assistantToggle = assistant.querySelector('.assistant-toggle');
    const assistantMessages = assistant.querySelector('.assistant-messages');
    const assistantInput = assistant.querySelector('#assistant-input');
    const answers = [
        { terms: ['build', 'built', 'project', 'work', 'tannora'], answer: 'The selected work includes JDH Studio, Tannora, JDH Studio Leadflow, Noma House, and Simple Bank App.', link: 'projects.html', label: 'See selected work' },
        { terms: ['jdh', 'studio', 'founder'], answer: 'JDH Studio is John\'s founder-led technology studio for practical web products, automation experiments, and useful digital experiences.', link: 'about.html', label: 'Learn about JDH Studio' },
        { terms: ['learn', 'skill', 'python', 'agent', 'automation', 'ai'], answer: 'John is strengthening Python, APIs, backend development, Git, AI APIs, coding agents, tool calling, automation, and product development.', link: 'about.html', label: 'View the working direction' },
        { terms: ['contact', 'collaborate', 'hire', 'start', 'talk'], answer: 'Bring a clear problem, rough idea, project question, or review of past work. The Contact page is the best starting point.', link: 'contact.html', label: 'Start a conversation' }
    ];

    function addAssistantMessage(text, type = 'bot', action) {
        const message = document.createElement('p');
        message.className = `assistant-message assistant-message-${type}`;
        message.textContent = text;
        if (action) {
            const link = document.createElement('a');
            link.className = 'assistant-action';
            link.href = action.link;
            link.textContent = action.label;
            message.appendChild(link);
        }
        assistantMessages.appendChild(message);
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }

    function answerAssistant(question) {
        const normalized = question.toLowerCase();
        const match = answers.find((entry) => entry.terms.some((term) => normalized.includes(term)));
        if (match) addAssistantMessage(match.answer, 'bot', match);
        else addAssistantMessage('I can help with selected work, JDH Studio, the learning direction, or starting a conversation.', 'bot', { link: 'contact.html', label: 'Contact John' });
    }

    assistantToggle.addEventListener('click', () => {
        const open = assistantPanel.hidden;
        assistantPanel.hidden = !open;
        assistantToggle.setAttribute('aria-expanded', String(open));
        if (open) assistantInput.focus();
    });
    assistant.querySelector('.assistant-close').addEventListener('click', () => {
        assistantPanel.hidden = true;
        assistantToggle.setAttribute('aria-expanded', 'false');
    });
    assistant.querySelectorAll('[data-assistant-question]').forEach((button) => button.addEventListener('click', () => {
        const question = button.dataset.assistantQuestion;
        addAssistantMessage(question, 'user');
        answerAssistant(question);
    }));
    assistant.querySelector('.assistant-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const question = assistantInput.value.trim();
        if (!question) return;
        addAssistantMessage(question, 'user');
        answerAssistant(question);
        assistantInput.value = '';
    });
}
