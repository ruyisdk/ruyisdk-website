import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portals
import Layout from '@theme/Layout';
import styles from './community.module.css';

// --- Portal Component for Background Blobs ---
// This component will render the blobs directly into the document body.
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


// --- Reusable UI Components ---

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const PersonCard = ({ person }) => {
  const { name, avatarUrl, title, titleColor = '#4A90E2', description, email, github } = person;
  const titleStyle = { backgroundColor: titleColor };
  
  return (
    <div className={styles.personCardInner}>
      <div style={{ flexShrink: 0, position: 'relative', width: '12rem', height: '12rem' }}>
        <img src={avatarUrl} alt={`${name}'s avatar`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/192x192/e0e0e0/757575?text=Avatar'; }} />
        <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '4rem', background: `linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8))`}}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', width: '100%', height: '12rem', color: 'black' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
            {email && ( <a href={`mailto:${email}`} style={{ transition: 'transform 0.2s', display: 'inline-block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}><MailIcon /></a> )}
            {github && ( <a href={github} target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.2s', display: 'inline-block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}><GithubIcon /></a> )}
          </div>
        </div>
        <div style={{ ...titleStyle, color: 'white', fontSize: '0.875rem', fontWeight: '600', padding: '0.125rem 0.75rem', borderRadius: '9999px', alignSelf: 'flex-start', margin: '0.25rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{title}</div>
        <p style={{ color: '#4A5568', fontSize: '1rem', marginTop: '0.5rem' }}>{description}</p>
      </div>
    </div>
  );
};

const Persons = ({ people }) => (
  <div className={styles.personsGrid}>
    {people.map(person => <PersonCard key={person.id} person={person} />)}
  </div>
);

const CommunityIntro = () => (
    <div className={`${styles.glassContainer} ${styles.communityIntro}`}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2D3748' }}>贡献者社区</h2>
        <a href="https://github.com/ruyisdk/ruyisdk/discussions" target="_blank" rel="noopener noreferrer" className={styles.appleButton}>
            加入讨论
        </a>
    </div>
);

const Partners = ({ partners }) => (
  <div className={styles.glassContainer}>
    <div className={styles.partnersGrid}>
      {partners.map(partner => (
        <div key={partner.id} className={styles.partnerLogoContainer}>
          <img src={partner.logoUrl} alt={partner.name} className={styles.partnerLogo} onError={(e) => { e.target.onerror=null; e.target.src='https://placehold.co/200x80/ffffff/000000?text='+partner.name; }}/>
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
  const coreTeam = [ { id: 1, name: 'xijing21', avatarUrl: 'https://avatars.githubusercontent.com/u/84754181?v=4', title: 'RuyiSDK 项目经理', titleColor: '#3498db', description: 'RuyiSDK 项目经理 一小段话', email: '', github: 'https://github.com/xijing21' },
    { id: 2, name: 'Yurish', avatarUrl: 'https://avatars.githubusercontent.com/u/52316103?v=4', title: 'RuyiSDK 社区经理', titleColor: '#e67e22', description: 'RuyiSDK 社区经理 一小段话', email: '', github: 'https://github.com/FIFCC' },
    { id: 3, name: 'xen0n', avatarUrl: 'https://avatars.githubusercontent.com/u/1175567?v=4', title: 'RuyiSDK 技术主管', titleColor: '#9b59b6', description: 'RuyiSDK 技术主管 一小段话', email: '', github: 'https://github.com/xen0n' },
    { id: 4, name: '狐坂澪夜', avatarUrl: 'https://avatars.githubusercontent.com/u/54651938?v=4', title: 'RuyiSDK 测试经理', titleColor: '#e67e22', description: 'RuyiSDK 测试经理 一小段话', email: '', github: 'https://github.com/weilinfox' },  ];
  const interns = [ { id: 1, name: 'a1gorhythm7', avatarUrl: 'https://avatars.githubusercontent.com/u/198067605?v=4', title: 'P119', titleColor: '#e67e22', description: '', email: '', github: 'https://github.com/a1gorhythm7' }, 
    { id: 2, name: 'Cyl18', avatarUrl: 'https://avatars.githubusercontent.com/u/14993992?v=4', title: 'P119', titleColor: '#e67e22', description: '', email: '', github: 'https://github.com/Cyl18/' },];
  const contributors = [ { id: 1, name: 'ArchFeh', avatarUrl: 'https://avatars.githubusercontent.com/u/16155165?v=4', title: '', titleColor: '#2ecc71', description: '', email: '', github: 'https://github.com/ArchFeh' },
    { id: 2, name: 'hush-coder', avatarUrl: 'https://avatars.githubusercontent.com/u/190342975?v=4', title: '', titleColor: '#2ecc71', description: '', email: '', github: 'https://github.com/hush-coder' },
    { id: 3, name: 'Kina', avatarUrl: 'https://avatars.githubusercontent.com/u/76783546?v=4', title: '', titleColor: '#2ecc71', description: '', email: '', github: 'https://github.com/delete-cloud' }, ];
  const partnersData = [ { id: 1, name: 'Milk-V', logoUrl: 'https://www.fedoravforce.org/partner-logo/milkv.png' }, { id: 2, name: 'Sipeed', logoUrl: 'https://www.fedoravforce.org/partner-logo/sipeed.png' }, { id: 3, name: 'Fedora-V Force', logoUrl: 'https://images.fedoravforce.org/images/fvf-logo.png' }, { id: 4, name: 'openEuler RISC-V sig', logoUrl: 'https://placehold.co/200x80/ffffff/000000?text=openEuler+RISC-V+sig' }, { id: 5, name: 'openKylin', logoUrl: 'https://www.openkylin.top/upload/202209/1664440595.png'}, ];
  const communityGuidelines = `## 我们的承诺
身为社区成员、贡献者和领袖，我们承诺使社区参与者不受骚扰，无论其年龄、体型、可见或不可见的缺陷、族裔、性征、性别认同和表达、经验水平、教育程度、社会与经济地位、国籍、相貌、种族、种姓、肤色、宗教信仰、性倾向或性取向如何。
我们承诺以有助于建立开放、友善、多样化、包容、健康社区的方式行事和互动。
## 我们的准则
有助于为我们的社区创造积极环境的行为例子包括但不限于：
* 表现出对他人的同情和善意
* 尊重不同的主张、观点和感受
* 提出和大方接受建设性意见
* 承担责任并向受我们错误影响的人道歉
* 注重社区共同诉求，而非个人得失
**不当行为例子包括：**
* 使用情色化的语言或图像，及性引诱或挑逗
* 嘲弄、侮辱或诋毁性评论，以及人身或政治攻击
* 公开或私下的骚扰行为
* 未经他人明确许可，公布他人的私人信息，如物理或电子邮件地址
* 其他有理由认定为违反职业操守的不当行为
## 责任和权力
社区领袖有责任解释和落实我们所认可的行为准则，并妥善公正地对他们认为不当、威胁、冒犯或有害的任何行为采取纠正措施。
社区领导有权力和责任删除、编辑或拒绝或拒绝与本行为准则不相符的评论（comment）、提交（commits）、代码、维基（wiki）编辑、议题（issues）或其他贡献，并在适当时机知采取措施的理由。
## 适用范围
本行为准则适用于所有社区场合，也适用于在公共场所代表社区时的个人。
代表社区的情形包括使用官方电子邮件地址、通过官方社交媒体帐户发帖或在线上或线下活动中担任指定代表。
## 监督
辱骂、骚扰或其他不可接受的行为可通过 [插入联系方式] 向负责监督的社区领袖报告。 所有投诉都将得到及时和公平的审查和调查。
所有社区领袖都有义务尊重任何事件报告者的隐私和安全。
## 处理方针
社区领袖将遵循下列社区处理方针来明确他们所认定违反本行为准则的行为的处理方式：
**1. 纠正**
**社区影响：**使用不恰当的语言或其他在社区中被认定为不符合职业道德或不受欢迎的行为。
**处理意见：**由社区领袖发出非公开的书面警告，明确说明违规行为的性质，并解释举止如何不妥。或将要求公开道歉。
**2. 警告**
**社区影响：**单个或一系列违规行为。
**处理意见：**警告并对连续性行为进行处理。在指定时间内，不得与相关人员互动，包括主动与行为准则执行者互动。这包括避免在社区场所和外部渠道中的互动。违反这些条款可能会导致临时或永久封禁。
**3. 临时封禁**
**社区影响:** 严重违反社区准则，包括持续的不当行为。
**处理意见:** 在指定时间内，暂时禁止与社区进行任何形式的互动或公开交流。在此期间，不得与相关人员进行公开或私下互动，包括主动与行为准则执行者互动。违反这些条款可能会导致永久封禁。
**4. 永久封禁**
**社区影响：**行为模式表现出违反社区准则，包括持续的不当行为、骚扰个人或攻击或贬低某个类别的个体。
**处理意见：**永久禁止在社区内进行任何形式的公开互动。
## 参见
本行为准则改编自 Contributor Covenant 2.1 版, 参见 https://www.contributor-covenant.org/version/2/1/code_of_conduct.html。
社区处理方针灵感来源于 Mozilla's code of conduct enforcement ladder。
有关本行为准则的常见问题的答案，参见 https://www.contributor-covenant.org/faq。 其他语言翻译参见 https://www.contributor-covenant.org/translations。`;

  return (
    <Layout title="Community" description="Meet the RuyiSDK community, contributors, and partners.">
      <BackgroundBlobs />
      
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          <h1 className={styles.mainHeader}>We ❤ You ❤ Ruyi</h1>
          
          <CommunityIntro />

          <h2 className={styles.sectionHeader}>核心小组</h2>
          <div className={styles.glassContainer}>
            <Persons people={coreTeam} />
          </div>

          <h2 className={styles.sectionHeader}>We ❤️ Interns</h2>
          <div className={styles.glassContainer}>
            <Persons people={interns} />
          </div>
          
          <h2 className={styles.sectionHeader}>贡献者</h2>
          <div className={styles.glassContainer}>
            <Persons people={contributors} />
          </div>
          
          <h2 className={styles.sectionHeader}>合作伙伴</h2>
          <Partners partners={partnersData} />
          
          <h2 className={styles.sectionHeader}>贡献者公约</h2>
          <Text markdownContent={communityGuidelines} />
        </div>
      </div>
    </Layout>
  );
}
