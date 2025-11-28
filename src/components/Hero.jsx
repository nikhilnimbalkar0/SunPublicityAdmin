import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const EditHero = () => {
  const [data, setData] = useState({
    videoUrl: "",
    buttonText: "",
    buttonLink: "",
    brightness: 1,
    contrast: 1,
    saturate: 1,
  });

  // Fetch existing data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "hero_section", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setData(docSnap.data());
    };
    fetchData();
  }, []);

  // Save to Firebase
  const saveData = async () => {
    await setDoc(doc(db, "hero_section", "main"), data);
    alert("Hero Section Updated!");
  };

  return (
    <div>
      <h2>🎬 Edit Hero Section</h2>
      <input type="text" placeholder="Video URL" value={data.videoUrl}
        onChange={(e) => setData({ ...data, videoUrl: e.target.value })} />

      <input type="text" placeholder="Button Text" value={data.buttonText}
        onChange={(e) => setData({ ...data, buttonText: e.target.value })} />

      <input type="text" placeholder="Button Link" value={data.buttonLink}
        onChange={(e) => setData({ ...data, buttonLink: e.target.value })} />

      <input type="number" step="0.1" placeholder="Brightness" value={data.brightness}
        onChange={(e) => setData({ ...data, brightness: e.target.value })} />

      <button onClick={saveData}>Update Hero</button>
    </div>
  );
};

export default EditHero;
