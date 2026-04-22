'use client';
import { useState, useCallback } from 'react';
import LoadingScreen from './LoadingScreen';

export default function LoadingScreenWrapper() {
  const [done, setDone] = useState(false);
  const handleDone = useCallback(() => setDone(true), []);
  if (done) return null;
  return <LoadingScreen onDone={handleDone} />;
}
