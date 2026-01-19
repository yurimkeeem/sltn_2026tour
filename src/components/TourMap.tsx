import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { TourDate } from '../types';
import 'leaflet/dist/leaflet.css';

interface TourMapProps {
  tourDates: TourDate[];
  onMarkerClick: (tourDate: TourDate) => void;
  selectedId?: string;
}

export function TourMap({ tourDates, onMarkerClick, selectedId }: TourMapProps) {
  // 한국 중심 좌표
  const koreaCenter: LatLngExpression = [36.0, 127.8];

  return (
    <MapContainer
      center={koreaCenter}
      zoom={7}
      style={{ height: '100%', width: '100%', background: '#fafafa' }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      {/* 미니멀한 흰색 배경 지도 */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />

      {tourDates.map((tourDate) => {
        const isSelected = selectedId === tourDate.id;
        return (
          <CircleMarker
            key={tourDate.id}
            center={tourDate.coordinates}
            radius={isSelected ? 18 : 12}
            pathOptions={{
              color: isSelected ? '#6c5ce7' : '#a29bfe',
              fillColor: isSelected ? '#6c5ce7' : '#a29bfe',
              fillOpacity: isSelected ? 0.9 : 0.7,
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
                <br />
                <small>{tourDate.date}</small>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
