import React from 'react';
import Header from './Header';

export default function CodeBlockToolbar({
  title,
  code,
  isHovered,
  copiable,
  langs,
  currentLang,
  onLangChange,
  isTerminal,
}) {
  return (
    <Header
      title={title}
      code={code}
      isHovered={isHovered}
      copiable={copiable}
      langs={langs}
      currentLang={currentLang}
      onLangChange={onLangChange}
      isTerminal={isTerminal}
    />
  );
}
