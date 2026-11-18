
// A decorative background animation with moving blobs.
const HomeBackground = () => {

  const blobBase = {
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    borderRadius: '50%',
    filter: 'blur(64px)',
    opacity: 0.85,
    pointerEvents: 'none',
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 bg-linear-to-b from-transparent to-(--ifm-background-color) pointer-events-none">
      <div style={{ ...blobBase, background: `radial-gradient(circle at 30% 30%, var(--home-ruyi-light-blue), transparent 60%)`}} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 70% 40%, var(--home-ruyi-light-gold), transparent 60%)`}} />
      <div style={{ ...blobBase, background: `radial-gradient(circle at 50% 20%, var(--home-ruyi-blue), transparent 60%)`, opacity: 0.65 }} />
    </div>
  );
};

const PageBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        aria-hidden
        className="absolute top-0 left-0 rounded-full -z-10"
        style={{ width: 640, height: 640, background: 'var(--ruyi-page-glow-1)', filter: 'blur(120px)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 rounded-full -z-10"
        style={{ width: 720, height: 720, background: 'var(--ruyi-page-glow-2)', filter: 'blur(130px)' }}
      />
    </div>
  );
};

export default HomeBackground;
export { PageBackground };
