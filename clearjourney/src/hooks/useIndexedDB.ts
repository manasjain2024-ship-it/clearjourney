import { useState, useEffect } from 'react';
import { getAllScans, saveScan, clearAllScans } from '../services/db';
import { ScanRecord } from '../types';

export function useIndexedDB() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshScans = async () => {
    try {
      setLoading(true);
      const list = await getAllScans();
      setScans(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshScans();
  }, []);

  const addScan = async (scan: ScanRecord) => {
    await saveScan(scan);
    await refreshScans();
  };

  const resetDB = async () => {
    await clearAllScans();
    await refreshScans();
  };

  return {
    scans,
    loading,
    error,
    refreshScans,
    addScan,
    resetDB,
  };
}
