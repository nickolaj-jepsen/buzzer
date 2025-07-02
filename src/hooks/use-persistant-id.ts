import { useEffect, useState } from "react";

const getPersistantId = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const storedId = localStorage.getItem("persistant-id");
  if (storedId) {
    return storedId;
  }
  const newId = crypto.randomUUID();
  localStorage.setItem("persistant-id", newId);
  return newId;
};

export const usePersistantId = () => {
  const [id, setId] = useState<string | null>(getPersistantId());

  useEffect(() => {
    const id = getPersistantId();
    setId(id);
  }, []);

  return id;
};
