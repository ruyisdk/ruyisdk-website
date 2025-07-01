import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@theme/Layout';
import styles from './community.module.css';
import Translate, { translate } from '@docusaurus/Translate';

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

// --- Person Cards (Unchanged) ---
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

// --- CommunityIntro Component ---
const CommunityIntro = () => {
    const BackgroundBlobs = () => (
        <>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
            <div className={`${styles.blob} ${styles.blob3}`}></div>
        </>
    );

    return (
        <div className={`${styles.glassContainer} ${styles.communityIntro}`}>
            <div className={styles.communityIntroLeft}>
                <BackgroundBlobs />
                <h2 className={styles.communityIntroTitle}><Translate>贡献者社区</Translate></h2>
            </div>
            <div className={styles.communityIntroRight}>
                <p className={styles.communityIntroText}>
                    <Translate>
                        RuyiSDK 项目采用开源管理模式，代码托管于 GitHub。我们欢迎广大开发者参与项目，共同推动RISC-V技术的发展。RUYISDK 社区旨在建设一个开放、友善、多样化、包容、健康活跃的社区。我们正在寻找有激情、有才华的您加入我们的团队。在参与社区讨论前，请先查阅社区守则以便更好的在社区内交流。
                    </Translate>
                </p>
                <a href="https://github.com/ruyisdk/ruyisdk/discussions" target="_blank" rel="noopener noreferrer" className={styles.appleButton}>
                    <Translate>加入讨论</Translate>
                </a>
            </div>
        </div>
    );
};

// --- UPDATED Partners Component ---
const Partners = ({ partners }) => (
    <div className={styles.glassContainer}>
        <div className={styles.partnersGrid}>
            {partners.map(partner => (
                <a 
                    key={partner.id} 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                >
                    <div className={styles.partnerLogoContainer}>
                        <img src={partner.logoUrl} alt={partner.name} className={styles.partnerLogo} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x80/ffffff/000000?text=' + partner.name; }} />
                    </div>
                </a>
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
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- UPDATED partnersData array ---
    const partnersData = [
        { id: 1, name: 'Milk-V', logoUrl: 'https://www.fedoravforce.org/partner-logo/milkv.png', url: 'https://milkv.io/' },
        { id: 2, name: 'Sipeed', logoUrl: 'https://www.fedoravforce.org/partner-logo/sipeed.png', url: 'https://sipeed.com/' },
        { id: 3, name: 'Fedora-V Force', logoUrl: 'https://images.fedoravforce.org/images/fvf-logo.png', url: 'https://www.fedoravforce.org/' },
        { id: 4, name: 'openEuler RISC-V sig', logoUrl: 'https://www.fedoravforce.org/partner-logo/openeuler.png', url: 'https://www.openeuler.org/en/sig/sig-detail/?name=sig-RISC-V' },
        { id: 5, name: 'openKylin', logoUrl: 'https://www.openkylin.top/upload/202209/1664440595.png', url: 'https://www.openkylin.top/' },
    ];

    const [communityGuidelines, setCommunityGuidelines] = useState('');
    const [peopleData, setPeopleData] = useState({ coreTeam: [], interns: [], contributors: [] });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        let detectedLocale = 'en';
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const configuredLocales = ['zh-Hans', 'en', 'de'];
        const defaultSiteLocale = 'zh-Hans';

        if (pathParts.length > 0 && configuredLocales.includes(pathParts[0])) {
            detectedLocale = pathParts[0];
        } else {
            detectedLocale = defaultSiteLocale;
        }

        const mdFilesBaseDir = '/text/';
        const mdPublicUrl = `${mdFilesBaseDir}community_guidelines_${detectedLocale}.md`;
        fetch(mdPublicUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} for ${response.url}`);
                }
                return response.text();
            })
            .then(text => setCommunityGuidelines(text))
            .catch(error => {
                console.error('Error fetching markdown file:', error);
                setCommunityGuidelines(`Error loading guidelines: ${error.message}. Please check console.`);
            });

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
            setPeopleData(peopleJsonModule);
        } catch (error) {
            console.error('Error loading peoples JSON file for locale:', detectedLocale, error);
            setPeopleData({ coreTeam: [], interns: [], contributors: [] });
        }
    }, []);

    const PageBackground = () => {
        if (!isClient) return null;
        return ReactDOM.createPortal(
            <div>
                <div className={`${styles.pageBlob} ${styles.pageBlob1}`}></div>
                <div className={`${styles.pageBlob} ${styles.pageBlob2}`}></div>
            </div>,
            document.body
        );
    };

    return (
        <Layout title="Community" description="Meet the RuyiSDK community, contributors, and partners.">
            <PageBackground />
            <div className={styles.pageWrapper}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.mainHeader}>We <Translate>❤</Translate> You <Translate>❤</Translate> Ruyi</h1>

                    <CommunityIntro />

                    <h2 className={styles.sectionHeader}><Translate>核心小组</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.coreGrid}`}>
                        {peopleData.coreTeam.map(person => <CoreMemberCard key={person.id} person={person} />)}
                    </div>

                    <h2 className={styles.sectionHeader}><Translate>We ❤️ Interns</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.internGrid}`}>
                        {peopleData.interns.map(person => <InternCard key={person.id} person={person} />)}
                    </div>

                    <h2 className={styles.sectionHeader}><Translate>贡献者</Translate></h2>
                    <div className={`${styles.glassContainer} ${styles.contributorGrid}`}>
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