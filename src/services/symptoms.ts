// src/services/symptoms.ts
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { SymptomReport, AggregatedSymptoms } from "../types";

const SYMPTOMS_COLLECTION = "symptomReports";

// Save symptom report (anonymized)
export const saveSymptomReport = async (
  userId: string,
  day: number,
  symptoms: string[],
  severity?: "mild" | "moderate" | "severe",
  notes?: string
) => {
  try {
    const report: Omit<SymptomReport, "timestamp"> & { 
      timestamp: any;
      userId: string; // Store userId but won't be shown to others
    } = {
      userId, // For user's own history
      day,
      symptoms,
      severity,
      notes,
      timestamp: Date.now()
    };
    
    await addDoc(collection(db, SYMPTOMS_COLLECTION), report);
    return { success: true };
  } catch (error) {
    console.error("Error saving symptom report:", error);
    throw error;
  }
};

// Get aggregated symptom data for a specific day (anonymized)
export const getAggregatedSymptomsForDay = async (day: number): Promise<AggregatedSymptoms> => {
  try {
    const q = query(
      collection(db, SYMPTOMS_COLLECTION),
      where("day", "==", day)
    );
    
    const snapshot = await getDocs(q);
    const symptomCounts: { [key: string]: number } = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.symptoms && Array.isArray(data.symptoms)) {
        data.symptoms.forEach((symptomId: string) => {
          symptomCounts[symptomId] = (symptomCounts[symptomId] || 0) + 1;
        });
      }
    });
    
    return {
      day,
      symptomCounts,
      totalReports: snapshot.size
    };
  } catch (error) {
    console.error("Error getting aggregated symptoms:", error);
    return { day, symptomCounts: {}, totalReports: 0 };
  }
};

// Get user's own symptom history
export const getUserSymptomReports = async (userId: string): Promise<SymptomReport[]> => {
  try {
    const q = query(
      collection(db, SYMPTOMS_COLLECTION),
      where("userId", "==", userId),
      orderBy("day", "asc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        day: data.day,
        symptoms: data.symptoms,
        severity: data.severity,
        notes: data.notes,
        timestamp: data.timestamp
      };
    });
  } catch (error) {
    console.error("Error getting user symptom reports:", error);
    return [];
  }
};
