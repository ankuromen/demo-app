import { useState, useEffect } from "react";
import { LoadScript} from "@react-google-maps/api";

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
      libraries={["places"]}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
