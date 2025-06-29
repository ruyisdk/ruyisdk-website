import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@theme/Layout';
import styles from './community.module.css';
import Translate, { translate } from '@docusaurus/Translate';

// --- Portal Component for Background Blobs (Unchanged) ---
const BackgroundBlobs = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return ReactDOM.createPortal(
        <div>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
            <div className={`${styles.blob} ${styles.blob3}`}></div>
        </div>,
        document.body
    );
};

// --- Reusable UI Components (Unchanged) ---
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const GithubIcon = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

// --- Person Cards (Unchanged, but will now receive translated props) ---

const AvatarWithGithub = ({ avatarUrl, name, githubUrl, sizeClass = '' }) => (
    <div className={`${styles.avatarWrapper} ${sizeClass}`}>
        <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            className={styles.avatarImage}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/192x192/e0e0e0/757575?text=Avatar`; }}
        />
        {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubIconOnAvatar}>
                <GithubIcon size={20} className={styles.githubIconSvg} />
            </a>
        )}
    </div>
);

const CoreMemberCard = ({ person }) => {
    const { name, avatarUrl, title, titleColor = '#4A90E2', description, email, github } = person;
    const titleStyle = { backgroundColor: titleColor };

    return (
        <div className={styles.coreMemberCard}>
            {/* Left Column: Avatar, Name, Title */}
            <div className={styles.coreMemberLeftColumn}>
                <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={styles.avatarLarge} />
                <div className={styles.coreMemberHeader}>
                    <h3 className={styles.personName}>{name}</h3>
                    {email && (
                        <a href={`mailto:${email}`} className={styles.mailIconLink}>
                            <MailIcon />
                        </a>
                    )}
                </div>
                {title && <div className={styles.personTitle} style={titleStyle}>{title}</div>}
            </div>

            {/* Right Column: Description */}
            <p className={styles.personDescription}>{description}</p>
        </div>
    );
};

const InternCard = ({ person }) => {
    const { name, avatarUrl, title, titleColor = '#4A90E2', description, github } = person;
    const titleStyle = { backgroundColor: titleColor };

    return (
        <div className={styles.internCard}>
            <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={styles.avatarMedium} />
            <div className={styles.internInfo}>
                <h4 className={styles.personNameSmall}>{name}</h4>
                {title && <div className={styles.personTitleSmall} style={titleStyle}>{title}</div>}
                {description && <p className={styles.personDescriptionSmall}>{description}</p>}
            </div>
        </div>
    );
};

const ContributorCard = ({ person }) => {
    const { name, avatarUrl, github } = person;
    return (
        <div className={styles.contributorCard}>
            <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={styles.avatarSmall} />
            <p className={styles.contributorName}>{name}</p>
        </div>
    );
};

// --- Unchanged Components ---

const CommunityIntro = () => (
    <div className={`${styles.glassContainer} ${styles.communityIntro}`}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2D3748' }}><Translate>贡献者社区</Translate></h2>
        <a href="https://github.com/ruyisdk/ruyisdk/discussions" target="_blank" rel="noopener noreferrer" className={styles.appleButton}>
            <Translate>加入讨论</Translate>
        </a>
    </div>
);

const Partners = ({ partners }) => (
    <div className={styles.glassContainer}>
        <div className={styles.partnersGrid}>
            {partners.map(partner => (
                <div key={partner.id} className={styles.partnerLogoContainer}>
                    <img src={partner.logoUrl} alt={partner.name} className={styles.partnerLogo} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x80/ffffff/000000?text=' + partner.name; }} />
                </div>
            ))}
        </div>
    </div>
);

const Text = ({ markdownContent }) => {
    const htmlContent = markdownContent
        .split('\n')
        .map(line => {
            if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold mt-4 mb-2" style="color: #2D3748; font-size: 1.5rem; margin-top: 1rem; margin-bottom: 0.5rem;">${line.substring(3)}</h2>`;
            if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mt-6 mb-3" style="color: #1A202C; font-size: 1.875rem; margin-top: 1.5rem; margin-bottom: 0.75rem;">${line.substring(2)}</h1>`;
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<p style="margin: 0.5rem 0; color: #4A5568;">${line}</p>`;
        })
        .join('');
    return (
        <div className={`${styles.glassContainer} ${styles.textContainer}`} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
};

// --- Main Page Component ---
export default function Community() {
    const partnersData = [
        { id: 1, name: 'Milk-V', logoUrl: 'https://www.fedoravforce.org/partner-logo/milkv.png' },
        { id: 2, name: 'Sipeed', logoUrl: 'https://www.fedoravforce.org/partner-logo/sipeed.png' },
        { id: 3, name: 'Fedora-V Force', logoUrl: 'https://images.fedoravforce.org/images/fvf-logo.png' },
        { id: 4, name: 'openEuler RISC-V sig', logoUrl: 'https://www.fedoravforce.org/partner-logo/openeuler.png' },
        { id: 5, name: 'openKylin', logoUrl: 'https://www.openkylin.top/upload/202209/1664440595.png' },
    ];

    const [communityGuidelines, setCommunityGuidelines] = useState('');
    // Initialize peopleData with a structure that prevents errors before data loads
    const [peopleData, setPeopleData] = useState({ coreTeam: [], interns: [], contributors: [] });

    useEffect(() => {
        if (typeof window === 'undefined') {
            console.log('Running on server side, skipping window-dependent logic.');
            return;
        }

        let detectedLocale = 'en'; // Initialize with a default.
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const configuredLocales = ['zh-Hans', 'en', 'de'];
        const defaultSiteLocale = 'zh-Hans'; // From your docusaurus.config.js

        // --- Determine Locale ---
        console.group('Locale & Data Loading Debugging');
        console.log('Full Pathname:', window.location.pathname);
        console.log('Filtered Path Parts:', pathParts);

        if (pathParts.length > 0 && configuredLocales.includes(pathParts[0])) {
            detectedLocale = pathParts[0];
            console.log('Locale detected from URL prefix:', detectedLocale);
        } else {
            detectedLocale = defaultSiteLocale;
            console.log('No explicit locale prefix. Using site defaultLocale:', detectedLocale);
        }

        // --- Load Community Guidelines Markdown ---
        const mdFilesBaseDir = '/markdown_content/'; // Ensure this matches your static folder
        const mdPublicUrl = `${mdFilesBaseDir}community_guidelines_${detectedLocale}.md`;

        console.log('Attempting to fetch markdown from public URL:', mdPublicUrl);

        fetch(mdPublicUrl)
            .then(response => {
                if (!response.ok) {
                    console.error('Markdown Fetch Error: HTTP status not OK.', {
                        url: response.url,
                        status: response.status,
                        statusText: response.statusText,
                    });
                    throw new Error(`HTTP error! Status: ${response.status} for ${response.url}`);
                }
                return response.text();
            })
            .then(text => {
                console.log('Markdown content fetched successfully (first 100 chars):', text.substring(0, Math.min(text.length, 100)) + (text.length > 100 ? '...' : ''));
                setCommunityGuidelines(text);
            })
            .catch(error => {
                console.error('Error fetching markdown file:', error);
                setCommunityGuidelines(`Error loading guidelines: ${error.message}. Please check console.`);
            });

        // --- Load Peoples JSON Data ---
        let peopleJsonModule;
        try {
            switch (detectedLocale) {
                case 'zh-Hans':
                    peopleJsonModule = require('./peoples_zh-Hans.json');
                    break;
                case 'de':
                    peopleJsonModule = require('./peoples_de.json');
                    break;
                case 'en':
                default:
                    peopleJsonModule = require('./peoples_en.json');
                    break;
            }
            console.log('People data loaded successfully for locale:', detectedLocale, peopleJsonModule);
            setPeopleData(peopleJsonModule);
        } catch (error) {
            console.error('Error loading peoples JSON file for locale:', detectedLocale, error);
            // Fallback to a default empty structure if loading fails
            setPeopleData({ coreTeam: [], interns: [], contributors: [] });
        }
        console.groupEnd(); // End of debug group

    }, []); // Empty dependency array: runs once after initial render on client

    return (
        <Layout title="Community" description="Meet the RuyiSDK community, contributors, and partners.">
            <BackgroundBlobs />

            <div className={styles.pageWrapper}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.mainHeader}>We <Translate>❤</Translate> You <Translate>❤</Translate> Ruyi</h1>

                    <CommunityIntro />

                    <h2 className={styles.sectionHeader}><Translate>核心小组</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.coreGrid}`}>
                        {/* Ensure peopleData.coreTeam is an array before mapping */}
                        {peopleData.coreTeam.map(person => <CoreMemberCard key={person.id} person={person} />)}
                    </div>

                    <h2 className={styles.sectionHeader}><Translate>We ❤️ Interns</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.internGrid}`}>
                        {/* Ensure peopleData.interns is an array before mapping */}
                        {peopleData.interns.map(person => <InternCard key={person.id} person={person} />)}
                    </div>

                    <h2 className={styles.sectionHeader}><Translate>贡献者</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.contributorGrid}`}>
                        {/* Ensure peopleData.contributors is an array before mapping */}
                        {peopleData.contributors.map(person => <ContributorCard key={person.id} person={person} />)}
                    </div>

                    <h2 className={styles.sectionHeader}><Translate>合作伙伴</Translate></h2>
                    <Partners partners={partnersData} />

                    <h2 className={styles.sectionHeader}><Translate>贡献者公约</Translate></h2>
                    {communityGuidelines ? <Text markdownContent={communityGuidelines} /> : <p>Loading community guidelines...</p>}
                </div>
            </div>
        </Layout>
    );
}