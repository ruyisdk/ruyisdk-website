// A decorative background animation with moving blobs.
const BackgroundAnimation = () => {
  // Colors used in the original CSS :root
  const ruyiLightBlue = '#D9E0F3';
  const ruyiLightGold = '#FDEFC3';
  const ruyiBlue = '#90b3ff';

  const blobBase = {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.5,
    mixBlendMode: 'soft-light',
    pointerEvents: 'none',
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 bg-linear-to-b from-transparent to-(--home-background) pointer-events-none">
      <div style={{ ...blobBase, background: `radial-gradient(circle at 30% 30%, ${ruyiLightBlue}, transparent 60%)`, animation: 'blobMove1 15s infinite alternate ease-in-out' }} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 70% 40%, ${ruyiLightGold}, transparent 60%)`, animation: 'blobMove2 18s infinite alternate ease-in-out' }} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 50% 20%, ${ruyiBlue}, transparent 60%)`, animation: 'blobMove3 12s infinite alternate ease-in-out', opacity: 0.4 }} />
    </div>
  );
};

export default BackgroundAnimation;
