// Deklaracje typów dla InPost GeoWidget custom element
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'inpost-geowidget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          onpoint?: string;
          token?: string;
          language?: string;
          config?: string;
        },
        HTMLElement
      >;
    }
  }
}

// Rozszerzenie interfejsu Window dla InPost API
interface InPostGeoWidgetAPI {
  changePosition: (coords: { longitude: number; latitude: number }, zoom?: number) => void;
}

interface InPostGeoWidgetInitEvent extends CustomEvent {
  detail: {
    api: InPostGeoWidgetAPI;
  };
}

interface InPostPointSelectEvent extends CustomEvent {
  detail: {
    name: string;
    address: {
      line1?: string;
      line2?: string;
    };
    address_details?: {
      city?: string;
      province?: string;
      post_code?: string;
      street?: string;
      building_number?: string;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export {};
