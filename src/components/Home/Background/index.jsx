
// A decorative background animation with moving blobs.
const BackgroundAnimation = () => {

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
      <div style={{ ...blobBase, background: `radial-gradient(circle at 30% 30%, var(--home-ruyi-light-blue), transparent 60%)`}} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 70% 40%, var(--home-ruyi-light-gold), transparent 60%)`}} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 50% 20%, var(--home-ruyi-blue), transparent 60%)`, opacity: 0.4 }} />
    </div>
  );
};

export default BackgroundAnimation;
