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

  // Define colors used by the component
  const colors = {
    navyBlue: '#002677',
    creamBeige_light: 'rgb(252, 232, 164)',
    creamBeige: '#F8F3E2',
    white: '#FFFFFF',
    textDark: '#002677',
    lightGray: '#F5F5F7',
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    // New outer wrapper for full-width background
    fullWidthWrapper: {
      backgroundColor: colors.lightGray,
      padding: '1.5rem 0', // Apply vertical padding here, horizontal padding will be handled by contentWrapper or by content itself
      width: '100%', // Ensure it spans full width
    },
    // Renamed from 'wrapper' to 'contentWrapper' for clarity
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 1rem', // Padding for the content block itself
      gap: '1rem', // Spacing between elements within the content block
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      // backgroundColor is now on fullWidthWrapper
      borderRadius: '0.75rem', // Optional: if the content block should still look like a card on the lightGray bg
      // boxShadow: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.05)', // Optional: shadow for the content block
      margin: '0 auto', // Center the content block within the fullWidthWrapper
      maxWidth: '25rem', // Constrain width of the content block
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: colors.textDark,
      textAlign: 'center',
      marginBottom: '0.25rem',
    },
    qrImageLink: {
      display: 'block',
      cursor: 'pointer',
    },
    qrImage: {
      width: '9.375rem',
      height: '9.375rem',
      display: 'block',
      borderRadius: '0.5rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.creamBeige_light,
      color: colors.textDark,
      border: 'none',
      padding: '0.625rem 1.25rem',
      borderRadius: '62.4375rem',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease-out',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
      textDecoration: 'none',
      minWidth: '9.375rem',
      textAlign: 'center',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 0.25rem 1rem rgba(0, 0, 0, 0.18)',
      backgroundColor: colors.creamBeige,
    },
  };

  const dynamicButtonStyle = {
    ...styles.button,
    ...(isButtonHovered ? styles.buttonHover : {}),
  };

  if (!isMobile) {
    return null; // Display nothing if not on mobile
  }

  return (
    // This div now handles the full-width lightGray background
    <div style={styles.fullWidthWrapper}>
      {/* This div centers and constrains the actual content */}
      <div style={styles.contentWrapper}>
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
    </div>
  );
};

export default WeChatLink;