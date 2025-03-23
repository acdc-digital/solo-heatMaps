import React from "react";

const Canvas = () => {
  // Mock data for the heatmap - would be replaced with real data from your state/backend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Mock scores - normally would come from your backend
  const getRandomScore = () => Math.floor(Math.random() * 100);
  
  // Get a color based on the score
  const getColorClass = (score: number) => {
    if (score === null) return "bg-zinc-800";
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-emerald-400";
    if (score >= 50) return "bg-amber-400";
    if (score >= 30) return "bg-amber-500";
    if (score >= 10) return "bg-rose-400";
    return "bg-rose-600";
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-zinc-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Your HeatMap</h1>
        <p className="text-zinc-400">Track your daily scores over time</p>
      </div>
      
      <div className="bg-zinc-900 rounded-lg p-4 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-zinc-100">2025</h2>
          <p className="text-sm text-zinc-400">Daily scores from 0-100</p>
        </div>
        
        <div className="grid gap-4">
          {months.map((month, monthIndex) => (
            <div key={month} className="space-y-2">
              <div className="text-sm font-medium text-zinc-300">{month}</div>
              <div className="grid grid-cols-31 gap-1">
                {days.map((day) => {
                  // Skip days that don't exist in some months
                  if ((month === "Feb" && day > 28) || 
                      ((month === "Apr" || month === "Jun" || month === "Sep" || month === "Nov") && day > 30)) {
                    return <div key={day} className="w-5 h-5"></div>;
                  }
                  
                  // Only show scores for past days (or mock data in this case)
                  const hasScore = monthIndex < new Date().getMonth() || 
                                  (monthIndex === new Date().getMonth() && day <= new Date().getDate());
                  
                  const score = hasScore ? getRandomScore() : null;
                  
                  return (
                    <div 
                      key={day}
                      className={`w-5 h-5 rounded-sm ${getColorClass(score)} flex items-center justify-center`}
                      title={score !== null ? `${month} ${day}: Score ${score}` : ""}
                    >
                      <span className="text-[8px] text-zinc-100">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;