import { useEffect, useState } from "react";

const jsonCache = new Map();
const jsonInFlight = new Map();

const fetchJsonWithCache = async (url) => {
  if (jsonCache.has(url)) {
    return jsonCache.get(url);
  }

  if (jsonInFlight.has(url)) {
    return jsonInFlight.get(url);
  }

  const request = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load JSON from ${url}`);
      }
      return response.json();
    })
    .then((json) => {
      jsonCache.set(url, json);
      jsonInFlight.delete(url);
      return json;
    })
    .catch((error) => {
      jsonInFlight.delete(url);
      throw error;
    });

  jsonInFlight.set(url, request);
  return request;
};

const usePublicJson = (url, fallbackData) => {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    let isMounted = true;

    if (jsonCache.has(url)) {
      setData(jsonCache.get(url));
      return () => {
        isMounted = false;
      };
    }

    fetchJsonWithCache(url)
      .then((nextData) => {
        if (isMounted && nextData) {
          setData(nextData);
        }
      })
      .catch(() => {
        // Keep fallback data when request fails.
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return data;
};

export default usePublicJson;
