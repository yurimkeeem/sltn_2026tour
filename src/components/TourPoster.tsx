interface TourPosterProps {
  posterUrl?: string;
  tourName: string;
}

export function TourPoster({ posterUrl, tourName }: TourPosterProps) {
  if (!posterUrl) return null;

  return (
    <div className="poster-section">
      <img
        src={posterUrl}
        alt={`${tourName} 투어 포스터`}
        className="tour-poster"
      />
    </div>
  );
}
