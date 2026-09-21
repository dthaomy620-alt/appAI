import React, { useState, useEffect } from 'react';
import { StudentState, DailyActionPlan } from './types';
import { mockStudentState } from './data/mockStudentState';
import { MobileFrame } from './components/MobileFrame';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [studentState, setStudentState] = useState<StudentState>(() => {
    const saved = localStorage.getItem('unilife_student_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return mockStudentState;
  });

  const [actionPlan, setActionPlan] = useState<DailyActionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    // Check if user has already completed the initial setup
    const hasCompleted = localStorage.getItem('unilife_has_onboarded');
    return !hasCompleted;
  });

  // Call AI Endpoint to generate daily plan
  const fetchAiPlan = async (currentState: StudentState) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentState),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.plan) {
        setActionPlan(data.plan);
      }
    } catch (err) {
      console.error('Lỗi khi gọi AI API:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAiPlan(studentState);
  }, []);

  // Save updated state and re-run AI
  const handleSaveState = (updatedState: StudentState) => {
    setStudentState(updatedState);
    localStorage.setItem('unilife_student_state', JSON.stringify(updatedState));
    localStorage.setItem('unilife_has_onboarded', 'true');
    fetchAiPlan(updatedState);
  };

  const handleResetToDemo = () => {
    setStudentState(mockStudentState);
    localStorage.removeItem('unilife_student_state');
    localStorage.removeItem('unilife_has_onboarded');
    setShowOnboarding(true);
    fetchAiPlan(mockStudentState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-slate-50 to-purple-50/40 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Mobile Shell Frame */}
      <MobileFrame
        studentState={studentState}
        actionPlan={actionPlan}
        loading={loading}
        onRefreshAi={() => fetchAiPlan(studentState)}
        onUpdateState={handleSaveState}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onResetToDemo={handleResetToDemo}
      />

      {/* Onboarding / Personal Profile Wizard */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          localStorage.setItem('unilife_has_onboarded', 'true');
        }}
        studentState={studentState}
        onSaveState={handleSaveState}
      />
    </div>
  );
}
