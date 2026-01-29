import React from 'react';

const AvatarWithGithub = ({ avatarUrl, name, githubUrl, sizeClass = 'w-20 h-20' }) => {
  const img = (
    <img
      src={avatarUrl}
      alt={`${name}'s avatar`}
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/192x192/e0e0e0/757575?text=Avatar';
      }}
    />
  );

  return (
    <div className={`relative rounded-full overflow-hidden shadow-lg ${sizeClass}`}>
      {githubUrl ? (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}'s GitHub profile`} className="block w-full h-full">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
};

export default function ContributorCard({ person }) {
  const { name, avatarUrl, github } = person;
  const sizeClass = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28';

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]">
      <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={sizeClass} />
      {github ? (
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 text-center truncate max-w-[12rem] hover:underline">
          {name}
        </a>
      ) : (
        <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 text-center truncate max-w-[12rem]">{name}</p>
      )}
    </div>
  );
}