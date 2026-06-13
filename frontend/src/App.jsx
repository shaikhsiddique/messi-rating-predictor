import React, { useState } from "react";

const TEAMS = ["Barcelona", "Argentina", "Paris Saint-Germain", "Inter Miami"];
const COMPETITIONS = [
  { label: "La Liga / Ligue 1 / MLS", value: "domestic_league" },
  { label: "Champions League", value: "european" },
  { label: "World Cup / Copa America", value: "international" },
  { label: "Other", value: "other" },
];

const RONALDO_REACTIONS = [
  {
    minRating: 9.5,
    img: "https://media1.tenor.com/m/dO_yJkvJjUIAAAAC/ronaldo-messi.gif",
    caption: "Ronaldo watching Messi get 9.5+ 😭",
  },
  {
    minRating: 8.5,
    img: "https://media.tenor.com/CoQJCSac5FUAAAAM/ronaldo.gif",
    caption: "Ronaldo is SHOOK 😱",
  },
  {
    minRating: 7.5,
    img: "https://media.tenor.com/zzpqvc7acF4AAAA1/quai.webp",
    caption: "Ronaldo is not impressed 😒",
  },
  {
    minRating: 0,
    img: "https://media.tenor.com/h6vq5IKgTWQAAAAM/pinksviral-stantwt.gif",
    caption: "Ronaldo finally happy 😄 Messi had a bad game!",
  },
];

function getRonaldoReaction(r) {
  return RONALDO_REACTIONS.find((reaction) => r >= reaction.minRating);
}

function getRatingColor(r) {
  if (r >= 9) return "text-yellow-500";
  if (r >= 8) return "text-green-500";
  if (r >= 7) return "text-blue-500";
  return "text-red-500";
}
function getRatingBg(r) {
  if (r >= 9) return "bg-yellow-50 border-yellow-300";
  if (r >= 8) return "bg-green-50 border-green-300";
  if (r >= 7) return "bg-blue-50 border-blue-300";
  return "bg-red-50 border-red-300";
}
function getRatingBadge(r) {
  if (r >= 9) return "bg-yellow-500";
  if (r >= 8) return "bg-green-500";
  if (r >= 7) return "bg-blue-500";
  return "bg-red-500";
}
function getRatingLabel(r) {
  if (r >= 9.5) return "LEGENDARY";
  if (r >= 9) return "WORLD CLASS";
  if (r >= 8) return "EXCELLENT";
  if (r >= 7) return "GOOD";
  return "AVERAGE";
}

function Field({ label, name, value, onChange, min = 0, max = 20, step = 1, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    goals: 1,
    assists: 1,
    minutes_played: 90,
    shots: 4,
    shots_on_target: 2,
    free_kick_attempts: 1,
    successful_dribbles: 3,
    key_passes: 3,
    big_chances_created: 1,
    accurate_throughballs: 1,
    aerial_duels_won: 0,
    messi_team: "Barcelona",
    messi_team_score: 2,
    opponent_score: 0,
    age: 27,
    is_home: 1,
    result: "W",
    competition: "domestic_league",
  });
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: isNaN(value) || value === "" ? value : Number(value),
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const errs = {};
    const goals = Number(form.goals);
    const teamScore = Number(form.messi_team_score);
    const oppScore = Number(form.opponent_score);
    const shots = Number(form.shots);
    const shotsOnTarget = Number(form.shots_on_target);
    const minutes = Number(form.minutes_played);

    if (goals > teamScore) {
      errs.goals = "Can't be more than team goals";
      errs.messi_team_score = "Team goals must be ≥ Messi's goals";
    }
    if (shotsOnTarget > shots) {
      errs.shots_on_target = "Shots on target can't exceed total shots";
      errs.shots = "Total shots must be ≥ shots on target";
    }
    if (teamScore > oppScore && form.result !== "W") {
      errs.result = "Score indicates a Win — select 'Win'";
    } else if (teamScore < oppScore && form.result !== "L") {
      errs.result = "Score indicates a Loss — select 'Loss'";
    } 
    if (minutes > 120) errs.minutes_played = "Max 120 minutes";
    if (minutes < 1) errs.minutes_played = "Min 1 minute";

    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
    setLoading(true);
    setError(null);
    setRating(null);
    setFieldErrors({});

    const shots = form.shots || 1;
    const payload = {
      ...form,
      shot_accuracy: form.shots_on_target / shots,
      competition_group_domestic_league: form.competition === "domestic_league" ? 1 : 0,
      competition_group_european: form.competition === "european" ? 1 : 0,
      competition_group_international: form.competition === "international" ? 1 : 0,
      competition_group_other: form.competition === "other" ? 1 : 0,
    };
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setRating(data.rating);
    } catch {
      setError("Backend not running. Start it with: uvicorn main:app --reload");
    }
    setLoading(false);
  };

  const ronaldoReaction = rating !== null ? getRonaldoReaction(rating) : null;

  return (
    <div className="min-h-screen font-sans bg-gray-900">
      {/* Full screen background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,20,80,0.8) 100%), url('https://images.unsplash.com/photo-1667983090922-3a996b026a26?w=1400&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Transparent Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg shadow">⚽</div>
            <span className="text-white font-bold text-lg tracking-tight">MessiRating.ai</span>
          </div>
          <div className="flex gap-6">
            {[["758", "Matches"], ["0.88", "R²"], ["0.30", "MAE"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-white font-bold text-lg leading-none">{n}</div>
                <div className="text-white/60 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase border border-white/20">
              XGBoost · R² 0.88 · MAE 0.30
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
              Predict the<br />
              <span className="text-yellow-400">GOAT's</span> Rating
            </h1>
            <p className="text-white/75 text-lg max-w-lg leading-relaxed">
              Enter any match stats and our ML model — trained on 758 real Messi
              career matches across 20 seasons — predicts his performance rating.
            </p>
          </div>
          <div className="hidden md:flex justify-end">
            <img
              src="https://media.gettyimages.com/id/1451381152/photo/lusail-city-qatar-lionel-messi-of-argentina-kisses-the-fifa-world-cup-qatar-2022-winners.jpg?s=612x612&w=0&k=20&c=ZM3gBMz_F5dJSts7Ea71RJJjuwU57wYqTLT5X-VGj8c="
              alt="Lionel Messi"
              className="w-72 h-72 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* White bottom sheet */}
      <div className="relative z-10 bg-transparent rounded-t-3xl min-h-screen shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-10" />

          {/* Section 01 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest">01</span>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Match Context</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SelectField label="Messi's Team" name="messi_team" value={form.messi_team} onChange={handleChange}
                options={TEAMS.map((t) => ({ value: t, label: t }))} />
              <SelectField label="Competition" name="competition" value={form.competition} onChange={handleChange}
                options={COMPETITIONS} />
              <SelectField label="Result" name="result" value={form.result} onChange={handleChange}
                options={[{ value: "W", label: "Win" }, { value: "D", label: "Draw" }, { value: "L", label: "Loss" }]}
                error={fieldErrors.result} />
              <SelectField label="Venue" name="is_home" value={form.is_home} onChange={handleChange}
                options={[{ value: 1, label: "Home" }, { value: 0, label: "Away" }]} />
              <Field label="Team Score" name="messi_team_score" value={form.messi_team_score} onChange={handleChange} max={20} error={fieldErrors.messi_team_score} />
              <Field label="Opponent Score" name="opponent_score" value={form.opponent_score} onChange={handleChange} max={20} />
              <Field label="Age" name="age" value={form.age} onChange={handleChange} min={17} max={40} step={0.1} />
              <Field label="Minutes Played" name="minutes_played" value={form.minutes_played} onChange={handleChange} min={1} max={120} error={fieldErrors.minutes_played} />
            </div>
          </div>

          <div className="border-t border-gray-100 my-6" />

          {/* Section 02 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest">02</span>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Performance Stats</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                ["Goals", "goals"], ["Assists", "assists"], ["Shots", "shots"],
                ["Shots on Target", "shots_on_target"], ["Dribbles", "successful_dribbles"],
                ["Key Passes", "key_passes"], ["Big Chances", "big_chances_created"],
                ["Throughballs", "accurate_throughballs"], ["Free Kicks", "free_kick_attempts"],
                ["Aerial Duels", "aerial_duels_won"],
              ].map(([label, name]) => (
                <Field key={name} label={label} name={name} value={form[name]} onChange={handleChange} error={fieldErrors[name]} />
              ))}
            </div>
            {Object.keys(fieldErrors).length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-3 items-center">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-red-800 text-sm">Please fix the highlighted fields before predicting.</p>
              </div>
            )}
          </div>

          {/* Hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex gap-3 items-center">
            <span className="text-amber-500 text-lg">💡</span>
            <p className="text-amber-800 text-sm m-0">
              <span className="font-semibold">Top predictors:</span> Goals (40%) · Assists (19%) · Dribbles (10%)
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>⚽ Predict Match Rating</>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
          )}

          {/* Result */}
         {rating !== null && (
  <div className="mt-8 relative">
    
    {/* Main card */}
    <div className={`rounded-3xl border-2 p-10 text-center ${getRatingBg(rating)}`}>
      
      {/* Ronaldo GIF — overlapping top right */}
      {ronaldoReaction && (
        <div className="absolute -top-8 -right-4 z-20">
          <div className="relative">
            <img
              src={ronaldoReaction.img}
              alt="Ronaldo reaction"
              className="w-52 h-52 object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
            {/* Speech bubble */}
            <div className="absolute -top-8 -left-16 bg-white rounded-2xl px-3 py-1.5 shadow-lg border border-gray-100 whitespace-nowrap">
              <p className="text-xs font-bold text-gray-700">{ronaldoReaction.caption}</p>
              {/* bubble tail */}
              <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
            </div>
          </div>
        </div>
      )}

      {/* Rating label top */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Predicted Match Rating
      </p>

      {/* Big rating number */}
      <div className={`text-9xl font-black leading-none tracking-tighter ${getRatingColor(rating)}`}>
        {rating.toFixed(1)}
      </div>

      {/* Badge */}
      <div className={`inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-2 rounded-full mt-4 ${getRatingBadge(rating)}`}>
        ⭐ {getRatingLabel(rating)}
      </div>

      <p className="text-gray-400 text-xs mt-4">
        out of 10.0 · XGBoost Model · R² 0.88
      </p>

      {/* Ronaldo caption bottom */}
      {ronaldoReaction && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Ronaldo's Reaction 👀
          </p>
         
        </div>
      )}
    </div>
  </div>
)}

          <div className="text-center text-gray-400 text-xs mt-12 pb-6">
            Built with React + FastAPI + XGBoost · 758 Messi matches · by Siddique Shaikh
          </div>
        </div>
      </div>
    </div>
  );
}