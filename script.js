// CV Scanner Application
class CVScanner {
    constructor() {
        this.currentFile = null;
        this.cvContent = '';
        this.analysisData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const resetBtn = document.getElementById('resetBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        dropZone.addEventListener('click', () => fileInput.click());

        // File input
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Buttons
        uploadBtn.addEventListener('click', () => this.uploadFile());
        resetBtn.addEventListener('click', () => this.reset());
        downloadBtn.addEventListener('click', () => this.downloadReport());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropZone').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropZone').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropZone').classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.currentFile = files[0];
            this.updateFileInfo();
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.currentFile = files[0];
            this.updateFileInfo();
        }
    }

    updateFileInfo() {
        const fileInfo = document.getElementById('fileInfo');
        if (this.currentFile) {
            const sizeMB = (this.currentFile.size / 1024 / 1024).toFixed(2);
            fileInfo.innerHTML = `✓ File selected: <strong>${this.currentFile.name}</strong> (${sizeMB} MB)`;
            fileInfo.className = 'file-info success';
        }
    }

    uploadFile() {
        if (!this.currentFile) {
            alert('Please select a file first');
            return;
        }

        this.showLoading(true);
        this.readFile();
    }

    readFile() {
        const reader = new FileReader();
        const fileName = this.currentFile.name.toLowerCase();

        if (fileName.endsWith('.txt')) {
            reader.onload = (e) => {
                this.cvContent = e.target.result;
                this.analyzeCV();
            };
            reader.readAsText(this.currentFile);
        } else if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.match(/\.(jpg|jpeg|png)$/)) {
            // Simulate file reading for other formats
            reader.onload = (e) => {
                this.cvContent = this.generateMockCVContent();
                this.analyzeCV();
            };
            reader.readAsArrayBuffer(this.currentFile);
        } else {
            alert('Unsupported file format. Please use TXT, PDF, DOCX, or image files.');
            this.showLoading(false);
        }
    }

    generateMockCVContent() {
        // Mock CV content for demonstration
        return `John Doe
Email: john.doe@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable solutions and mentoring junior developers.

EXPERIENCE
Senior Software Engineer - Tech Company Inc. (2021-Present)
- Led development of microservices architecture serving 1M+ users
- Improved application performance by 40% through optimization
- Mentored 3 junior developers

Software Engineer - StartUp Co. (2019-2021)
- Developed REST APIs using Node.js and Express
- Implemented responsive UI using React
- Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of California, 2019

SKILLS
- Languages: JavaScript, Python, Java, C++
- Frontend: React, Vue.js, HTML5, CSS3
- Backend: Node.js, Express, Django, Spring Boot
- Databases: MongoDB, PostgreSQL, MySQL
- Tools: Git, Docker, Kubernetes, Jenkins
- Soft Skills: Leadership, Communication, Problem-solving`;
    }

    analyzeCV() {
        // Simulate analysis with timeout
        setTimeout(() => {
            this.analysisData = this.performAnalysis();
            this.displayResults();
            this.showLoading(false);
        }, 2000);
    }

    performAnalysis() {
        const analysis = {
            score: 0,
            details: [],
            recommendations: [],
            keywords: [],
            hasContact: false,
            hasExperience: false,
            hasEducation: false,
            hasSkills: false
        };

        const content = this.cvContent.toLowerCase();

        // Check for contact information
        const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/;
        const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        
        if (emailRegex.test(content)) {
            analysis.hasContact = true;
            analysis.score += 15;
            analysis.details.push('✓ Email address found');
        } else {
            analysis.details.push('✗ No email address found');
            analysis.recommendations.push('Add your email address for easier contact');
        }

        if (phoneRegex.test(content)) {
            analysis.hasContact = true;
            analysis.score += 10;
            analysis.details.push('✓ Phone number found');
        }

        // Check for work experience
        const experienceKeywords = ['experience', 'worked', 'employment', 'position', 'role', 'engineer', 'manager', 'developer'];
        const hasExperienceSection = experienceKeywords.some(keyword => content.includes(keyword));
        
        if (hasExperienceSection) {
            analysis.hasExperience = true;
            analysis.score += 25;
            analysis.details.push('✓ Work experience section found');
        } else {
            analysis.details.push('✗ Work experience section missing');
            analysis.recommendations.push('Add a detailed work experience section with job titles and responsibilities');
        }

        // Check for education
        const educationKeywords = ['education', 'degree', 'bachelor', 'master', 'university', 'college', 'school'];
        const hasEducationSection = educationKeywords.some(keyword => content.includes(keyword));
        
        if (hasEducationSection) {
            analysis.hasEducation = true;
            analysis.score += 20;
            analysis.details.push('✓ Education section found');
        } else {
            analysis.details.push('✗ Education section missing');
            analysis.recommendations.push('Include your educational background and qualifications');
        }

        // Check for skills
        const skillKeywords = ['skills', 'proficient', 'expertise', 'languages', 'technical', 'tools'];
        const hasSkillsSection = skillKeywords.some(keyword => content.includes(keyword));
        
        if (hasSkillsSection) {
            analysis.hasSkills = true;
            analysis.score += 20;
            analysis.details.push('✓ Skills section found');
        } else {
            analysis.details.push('✗ Skills section missing');
            analysis.recommendations.push('Add a comprehensive skills section highlighting your technical abilities');
        }

        // Extract keywords
        const allKeywords = ['javascript', 'python', 'react', 'node.js', 'sql', 'mongodb', 'leadership', 'communication', 'git', 'docker', 'kubernetes', 'aws', 'azure', 'java', 'css', 'html', 'typescript', 'angular', 'vue.js', 'api', 'rest', 'microservices', 'agile', 'scrum'];
        
        analysis.keywords = allKeywords.filter(keyword => content.includes(keyword));

        // Add bonus points for keywords
        analysis.score += Math.min(analysis.keywords.length * 2, 10);

        // Check content length
        if (this.cvContent.length < 300) {
            analysis.recommendations.push('Your CV seems short. Add more details about your achievements and experience');
            analysis.details.push('⚠ CV content is relatively brief');
        } else if (this.cvContent.length > 3000) {
            analysis.recommendations.push('Your CV might be too long. Try to condense it to 1-2 pages');
            analysis.details.push('⚠ CV content is quite lengthy');
        } else {
            analysis.score += 5;
            analysis.details.push('✓ Appropriate CV length');
        }

        // Check for action verbs
        const actionVerbs = ['led', 'developed', 'implemented', 'managed', 'created', 'designed', 'improved', 'increased', 'achieved', 'coordinated', 'collaborated'];
        const actionVerbsFound = actionVerbs.filter(verb => content.includes(verb));
        
        if (actionVerbsFound.length > 0) {
            analysis.score += 5;
            analysis.details.push(`✓ Found ${actionVerbsFound.length} action verbs`);
        } else {
            analysis.recommendations.push('Use more action verbs (e.g., "Led", "Developed", "Implemented") to describe your accomplishments');
        }

        // Cap score at 100
        analysis.score = Math.min(analysis.score, 100);

        return analysis;
    }

    displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';

        // Display preview
        this.displayPreview();

        // Display score
        this.displayScore();

        // Display metrics
        this.displayMetrics();

        // Display detailed analysis
        this.displayDetailedAnalysis();

        // Display recommendations
        this.displayRecommendations();

        // Display keywords
        this.displayKeywords();

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    displayPreview() {
        const preview = document.getElementById('cvPreview');
        const truncated = this.cvContent.substring(0, 500) + (this.cvContent.length > 500 ? '...' : '');
        preview.textContent = truncated;
    }

    displayScore() {
        const score = this.analysisData.score;
        const scoreValue = document.getElementById('scoreValue');
        const scoreDescription = document.getElementById('scoreDescription');

        // Animate score
        let current = 0;
        const interval = setInterval(() => {
            if (current < score) {
                current += 2;
                scoreValue.textContent = Math.min(current, score);
            } else {
                clearInterval(interval);
            }
        }, 20);

        // Score description
        let description = '';
        if (score >= 80) {
            description = '🎉 Excellent! Your CV is well-structured and comprehensive.';
        } else if (score >= 60) {
            description = '👍 Good! Your CV covers the main sections. See recommendations for improvements.';
        } else if (score >= 40) {
            description = '⚠️ Fair. Consider adding more sections and details.';
        } else {
            description = '📝 Needs improvement. Follow the recommendations below.';
        }
        scoreDescription.textContent = description;
    }

    displayMetrics() {
        const metrics = {
            contactStatus: this.analysisData.hasContact,
            experienceStatus: this.analysisData.hasExperience,
            educationStatus: this.analysisData.hasEducation,
            skillsStatus: this.analysisData.hasSkills
        };

        for (const [key, value] of Object.entries(metrics)) {
            const element = document.getElementById(key);
            if (value) {
                element.textContent = '✓';
                element.className = 'metric-status success';
            } else {
                element.textContent = '✗';
                element.className = 'metric-status error';
            }
        }
    }

    displayDetailedAnalysis() {
        const list = document.getElementById('analysisList');
        list.innerHTML = '';

        this.analysisData.details.forEach(detail => {
            const li = document.createElement('li');
            let className = '';
            
            if (detail.includes('✗')) {
                className = 'warning';
            } else if (detail.includes('✓')) {
                className = 'success';
            }
            
            li.className = className;
            li.textContent = detail;
            list.appendChild(li);
        });
    }

    displayRecommendations() {
        const list = document.getElementById('recommendationsList');
        list.innerHTML = '';

        if (this.analysisData.recommendations.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No recommendations - Your CV is well-optimized!';
            list.appendChild(li);
        } else {
            this.analysisData.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                list.appendChild(li);
            });
        }
    }

    displayKeywords() {
        const cloud = document.getElementById('keywordsCloud');
        cloud.innerHTML = '';

        if (this.analysisData.keywords.length === 0) {
            cloud.textContent = 'No technical keywords detected. Consider adding more specific skills.';
            return;
        }

        this.analysisData.keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = keyword.toUpperCase();
            cloud.appendChild(tag);
        });
    }

    showLoading(show) {
        document.getElementById('loadingState').style.display = show ? 'flex' : 'none';
    }

    downloadReport() {
        const reportContent = this.generateReport();
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV-Analysis-Report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    generateReport() {
        const timestamp = new Date().toLocaleString();
        let report = `CV ANALYSIS REPORT\n`;
        report += `Generated: ${timestamp}\n`;
        report += `File: ${this.currentFile.name}\n\n`;
        
        report += `OVERALL SCORE: ${this.analysisData.score}/100\n`;
        report += `${'='.repeat(50)}\n\n`;
        
        report += `DETAILED ANALYSIS:\n`;
        this.analysisData.details.forEach(detail => {
            report += `• ${detail}\n`;
        });
        
        report += `\nRECOMMENDATIONS:\n`;
        if (this.analysisData.recommendations.length === 0) {
            report += `• No recommendations - Your CV is well-optimized!\n`;
        } else {
            this.analysisData.recommendations.forEach(rec => {
                report += `• ${rec}\n`;
            });
        }
        
        report += `\nKEYWORDS DETECTED:\n`;
        report += this.analysisData.keywords.join(', ') || 'None';
        report += `\n\nCV PREVIEW:\n`;
        report += `${this.cvContent}\n`;

        return report;
    }

    reset() {
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').innerHTML = '';
        document.getElementById('fileInfo').className = 'file-info';
        document.getElementById('resultsSection').style.display = 'none';
        this.currentFile = null;
        this.cvContent = '';
        this.analysisData = null;
        document.querySelector('.upload-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CVScanner();
});
