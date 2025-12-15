interface AvatarProps {
  avatarType: string;
  relapse: boolean;
  streakDays: number;
  medals: string[];
  coins: number;
}

// Get border color based on streak days
const getStreakColor = (streakDays: number, relapse: boolean): string => {
  if (relapse) return "#ff4d4d"; // Red for relapse
  if (streakDays >= 90) return "#B9F2FF"; // Diamond (90+ days)
  if (streakDays >= 30) return "#FFD700"; // Gold (30+ days)
  if (streakDays >= 14) return "#C0C0C0"; // Silver (14+ days)
  if (streakDays >= 7) return "#CD7F32"; // Bronze (7+ days)
  return "#4CAF50"; // Green (starting)
};

export default function Avatar({ avatarType, relapse, streakDays, medals, coins }: AvatarProps) {
  const border = getStreakColor(streakDays, relapse);

  const medalEmoji = medals.includes("gold")
    ? "🥇"
    : medals.includes("silver")
    ? "🥈"
    : medals.includes("bronze")
    ? "🥉"
    : "";

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `3px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18
        }}
      >
        {avatarType[0]?.toUpperCase()}
      </div>

      {medalEmoji && (
        <div style={{ fontSize: 14, position: "absolute", bottom: -18, left: 6 }}>
          {medalEmoji}
        </div>
      )}

      <div style={{ fontSize: 10, position: "absolute", bottom: -18, right: 0 }}>
        {coins}💰
      </div>
    </div>
  );
}
