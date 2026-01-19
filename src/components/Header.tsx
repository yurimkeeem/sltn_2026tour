interface HeaderProps {
  bandName: string;
  tourName: string;
  year: number;
}

export function Header({ bandName, tourName, year }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="tour-title">
          <span className="band-name">{bandName}</span>
          <span className="tour-name">{tourName}</span>
        </h1>
        <span className="tour-year">{year} TOUR</span>
      </div>
    </header>
  );
}
