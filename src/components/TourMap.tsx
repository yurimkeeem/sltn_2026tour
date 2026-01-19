import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, Marker } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import type { TourDate } from '../types';
import 'leaflet/dist/leaflet.css';

interface TourMapProps {
  tourDates: TourDate[];
  onMarkerClick: (tourDate: TourDate) => void;
  selectedId?: string;
}

// 공연이 완료되었는지 확인
function isPastConcert(dateString: string): boolean {
  const concertDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  concertDate.setHours(0, 0, 0, 0);
  return concertDate < today;
}

// 다음 예정된 공연 찾기
function findNextUpcoming(tourDates: TourDate[]): TourDate | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...tourDates].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sorted.find(td => {
    const d = new Date(td.date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  }) || null;
}

// 마지막 완료된 공연 찾기
function findLastCompleted(tourDates: TourDate[]): TourDate | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sorted = [...tourDates].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sorted.find(td => {
    const d = new Date(td.date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  }) || null;
}

// 비행기 아이콘
const airplaneIcon = L.divIcon({
  html: '<div style="font-size: 24px; transform: rotate(45deg);">✈️</div>',
  className: 'airplane-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export function TourMap({ tourDates, onMarkerClick, selectedId }: TourMapProps) {
  // 한국 중심 좌표
  const koreaCenter: LatLngExpression = [36.0, 127.8];

  // 다음 공연과 마지막 완료 공연 찾기
  const nextUpcoming = findNextUpcoming(tourDates);
  const lastCompleted = findLastCompleted(tourDates);

  // 비행 경로 (마지막 완료 -> 다음 예정)
  const flightPath: LatLngExpression[] | null =
    lastCompleted && nextUpcoming
      ? [lastCompleted.coordinates, nextUpcoming.coordinates]
      : null;

  return (
    <MapContainer
      center={koreaCenter}
      zoom={7}
      style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      {/* 다크 스타일 지도 */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />

      {/* 비행 경로 점선 */}
      {flightPath && (
        <Polyline
          positions={flightPath}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            dashArray: '8, 8',
            opacity: 0.5,
          }}
        />
      )}

      {tourDates.map((tourDate) => {
        const isSelected = selectedId === tourDate.id;
        const isPast = isPastConcert(tourDate.date);
        const isNext = nextUpcoming?.id === tourDate.id;

        // 색상 결정: 완료=반투명 회색, 예정=흰색, 선택됨=강조
        let markerColor = isPast ? '#505050' : '#ffffff';
        let fillOpacity = isPast ? 0.4 : (isSelected ? 0.9 : 0.7);

        if (isSelected) {
          markerColor = '#ffffff';
          fillOpacity = 1;
        }

        return (
          <CircleMarker
            key={tourDate.id}
            center={tourDate.coordinates}
            radius={isSelected ? 18 : (isNext ? 14 : 12)}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: fillOpacity,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onMarkerClick(tourDate),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              permanent={isSelected}
            >
              <div className="map-tooltip">
                <strong>{tourDate.city}</strong>
                {isPast && <span style={{ marginLeft: '4px', opacity: 0.6 }}>✓</span>}
                {isNext && <span style={{ marginLeft: '4px' }}>🎵</span>}
                <br />
                <small>{tourDate.date}</small>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

      {/* 비행기 마커 (다음 공연 위치 근처) */}
      {nextUpcoming && lastCompleted && (
        <Marker
          position={[
            (lastCompleted.coordinates[0] + nextUpcoming.coordinates[0]) / 2,
            (lastCompleted.coordinates[1] + nextUpcoming.coordinates[1]) / 2,
          ]}
          icon={airplaneIcon}
        />
      )}
    </MapContainer>
  );
}
