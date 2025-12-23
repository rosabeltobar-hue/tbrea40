interface AvatarProps {
  avatarType: string;
  relapse: boolean;
  streakDays: number;
  medals: string[];
  coins: number;
}

export default function Avatar({ avatarType, relapse, streakDays, medals, coins }: AvatarProps) {
  const border = relapse ? "#ff4d4d" : "#4CAF50";

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
