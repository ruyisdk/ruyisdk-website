import { COLOR_VARS } from './constants';

export function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: `linear-gradient(90deg, ${COLOR_VARS.goldDark} 0%, ${COLOR_VARS.gold} 100%)` };
  }
  return { background: `linear-gradient(90deg, ${COLOR_VARS.blue} 0%, ${COLOR_VARS.blueDark} 100%)` };
}

export function primaryButtonStyle(accent) {
  if (accent === 'gold') {
    return {
      backgroundColor: COLOR_VARS.gold,
      color: COLOR_VARS.contrast,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    };
  }
  return {
    backgroundColor: COLOR_VARS.blue,
    color: 'white',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  };
}