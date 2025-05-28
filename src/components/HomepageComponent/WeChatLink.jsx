import React, { useState, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate'; // Assuming you might want to translate texts

// Placeholder QR Code Image URL (replace with your actual QR code URL)
const DEFAULT_QR_CODE_IMAGE_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://weixin.qq.com/r/mp/Rx3t9T3E42CcrXmW90hV&color=002677&bgcolor=F8F3E2';
const DEFAULT_LINK_URL = 'http://weixin.qq.com/r/mp/Rx3t9T3E42CcrXmW90hV';

const WeChatLink = ({
  qrCodeImageUrl = DEFAULT_QR_CODE_IMAGE_URL,
  linkUrl = DEFAULT_LINK_URL,
  titleText = translate({ message: 'RuyiSDK微信公众号', id: 'wechatlink.title', description: 'Title for WeChat link section' }),
  buttonText = translate({ message: '点击关注', id: 'wechatlink.buttonText', description: 'Button text for WeChat link' }),
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Define colors used by the component (can be imported from a shared theme if available)
  const colors = {
    navyBlue: '#002677',      // For title, button text, QR code color
    creamBeige_light: 'rgb(252, 232, 164)', // For button background
    creamBeige: '#F8F3E2',    // Alternative button background or QR bg
    white: '#FFFFFF',
    textDark: '#002677',      // Primarily for text
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 1rem', // 24px top/bottom, 16px left/right
      gap: '1rem', // 16px spacing between elements
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: colors.white, // Optional: give it a background if it's placed on a colored page
      borderRadius: '0.75rem', // 12px, optional if it needs to look like a card
      // boxShadow: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.05)', // Optional subtle shadow
      margin: '1rem auto', // Center it if it's narrower than its parent
      maxWidth: '25rem', // 400px, constrain width on mobile
    },
    title: {
      fontSize: '1.25rem', // 20px
      fontWeight: '700',
      color: colors.textDark,
      textAlign: 'center',
      marginBottom: '0.25rem', // 4px extra spacing if needed
    },
    qrImageLink: {
      display: 'block', // To ensure the link wraps the image correctly
      cursor: 'pointer',
    },
    qrImage: {
      width: '9.375rem', // 150px
      height: '9.375rem', // 150px
      display: 'block',
      borderRadius: '0.5rem', // 8px, slight rounding for the QR image
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)', // Subtle shadow for the QR
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.creamBeige_light,
      color: colors.textDark,
      border: 'none',
      padding: '0.625rem 1.25rem', // 10px 20px
      borderRadius: '62.4375rem', // 9999px (pill shape)
      fontWeight: '600',
      fontSize: '0.9rem', // 14.4px
      cursor: 'pointer',
      transition: 'all 0.2s ease-out',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)', // 0 2px 8px
      textDecoration: 'none',
      minWidth: '9.375rem', // 150px
      textAlign: 'center',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 0.25rem 1rem rgba(0, 0, 0, 0.18)', // Enhanced shadow
      backgroundColor: colors.creamBeige, // Slightly different shade on hover
    },
  };

  // Combine base and hover styles for the button
  const dynamicButtonStyle = {
    ...styles.button,
    ...(isButtonHovered ? styles.buttonHover : {}),
  };

  if (!isMobile) {
    return null; // Display nothing if not on mobile
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>{titleText}</h3>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.qrImageLink}
        aria-label={translate({ message: 'Open link by clicking QR code', id: 'wechatlink.qrAriaLabel', description: 'Accessibility label for QR code link' })}
      >
        <img src={qrCodeImageUrl} alt={translate({ message: 'QR Code', id: 'wechatlink.qrAltText', description: 'Alt text for QR code image' })} style={styles.qrImage} />
      </a>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={dynamicButtonStyle}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default WeChatLink;
