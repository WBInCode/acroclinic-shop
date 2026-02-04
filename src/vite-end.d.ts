/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Deklaracje typów dla InPost GeoWidget custom element
declare namespace JSX {
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