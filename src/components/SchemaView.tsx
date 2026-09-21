import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

export const SchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const schemaJson = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "StudentState",
  "description": "Student State System 4 trụ cột cho UniLife Companion",
  "type": "object",
  "properties": {
    "studentId": { "type": "string" },
    "fullName": { "type": "string" },
    "academicYear": { "type": "string" },
    "major": { "type": "string" },
    "personal": {
      "type": "object",
      "properties": {
        "university": { "type": "string" },
        "wakeUpTime": { "type": "string" },
        "sleepTime": { "type": "string" },
        "livingSituation": { "type": "string", "enum": ["RENTAL", "DORM", "WITH_FAMILY"] },
        "stressLevel": { "type": "string", "enum": ["HIGH", "MEDIUM", "LOW"] },
        "cookingHabit": { "type": "string", "enum": ["SELF_COOK", "EAT_OUT", "MIXED"] }
      }
    },
    "financial": {
      "type": "object",
      "properties": {
        "monthlyIncome": { "type": "number" },
        "savingsTarget": { "type": "number" },
        "fixedExpensesMonthly": { "type": "number" },
        "currentSpentThisMonth": { "type": "number" },
        "daysRemainingInMonth": { "type": "integer" }
      }
    },
    "learning": {
      "type": "object",
      "properties": {
        "subjects": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "subjectCode": { "type": "string" },
              "subjectName": { "type": "string" },
              "daysUntilExam": { "type": "integer" },
              "gaps": { "type": "array" }
            }
          }
        }
      }
    },
    "time": {
      "type": "object",
      "properties": {
        "totalFreeHoursToday": { "type": "number" },
        "fixedCommitments": { "type": "array" },
        "freeWindows": { "type": "array" }
      }
    },
    "goals": {
      "type": "object",
      "properties": {
        "academicGoal": { "type": "string" },
        "financialGoal": { "type": "string" },
        "wellbeingGoal": { "type": "string" }
      }
    }
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-slate-800">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">JSON Schema Student State</h3>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96">
          <pre>{schemaJson}</pre>
        </div>
      </div>
    </div>
  );
};
