import { useState, useEffect } from "react";
import { avatarOptions, generateAnonymousUsername, getAllCategories, getCategoryAvatars } from "../utils/avatars";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../context/UserContext";

interface ChatProfileSetupProps {
  onComplete: (displayName: string, avatar: string, customAvatarUrl?: string) => void;
  onCancel: () => void;
}

export default function ChatProfileSetup({ onComplete, onCancel }: ChatProfileSetupProps) {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Classic");
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    // Generate 3 suggested anonymous names
    setSuggestedNames([
      generateAnonymousUsername(),
      generateAnonymousUsername(),
      generateAnonymousUsername()
    ]);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      
      setCustomImage(file);
      setSelectedAvatar("custom");
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCustomAvatar = async (): Promise<string | null> => {
    if (!customImage || !user) return null;
    
    try {
      setUploading(true);
      const storage = getStorage();
      const fileName = `avatars/${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);
      
      // Resize image before upload
      const resizedBlob = await resizeImage(customImage, 200, 200);
      
      await uploadBytes(storageRef, resizedBlob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to resize image"));
          }
        }, "image/jpeg", 0.8);
      };
      
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!displayName.trim() || !selectedAvatar) return;
    
    let customAvatarUrl: string | undefined;
    
    if (selectedAvatar === "custom" && customImage) {
      customAvatarUrl = await uploadCustomAvatar() || undefined;
      if (!customAvatarUrl) return; // Upload failed
    }
    
    onComplete(displayName.trim(), selectedAvatar, customAvatarUrl);
  };

  const categories = getAllCategories();

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20,
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        padding: 30,
        maxWidth: 600,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "var(--shadow-xl)",
        animation: "slideInUp 0.4s ease-out"
      }}>
        <h2 style={{
          background: "var(--gradient-ocean)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginTop: 0,
          marginBottom: 10
        }}>
          🎭 Set Up Your Chat Identity
        </h2>
        
        <p style={{ color: "var(--gray-dark)", marginBottom: 25 }}>
          Choose an anonymous display name and avatar to protect your privacy in the community chat.
        </p>

        {/* Display Name */}
        <div style={{ marginBottom: 25 }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            color: "var(--joy-purple)",
            marginBottom: 10
          }}>
            Display Name (Anonymous)
          </label>
          
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter a name or pick a suggestion below"
            maxLength={20}
            style={{
              width: "100%",
              padding: 12,
              border: "2px solid var(--joy-teal)",
              borderRadius: 8,
              fontSize: "1rem",
              boxSizing: "border-box"
            }}
          />
          
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-medium)", marginBottom: 8 }}>
              💡 Suggested anonymous names:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setDisplayName(name)}
                  style={{
                    padding: "6px 12px",
                    background: displayName === name ? "var(--joy-teal)" : "var(--gray-lightest)",
                    color: displayName === name ? "white" : "var(--gray-dark)",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() => {
                  setSuggestedNames([
                    generateAnonymousUsername(),
                    generateAnonymousUsername(),
                    generateAnonymousUsername()
                  ]);
                }}
                style={{
                  padding: "6px 12px",
                  background: "white",
                  color: "var(--joy-purple)",
                  border: "2px solid var(--joy-purple)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600
                }}
              >
                🔄 More
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div style={{ marginBottom: 25 }}>
          <label style={{
            display: "block",
            fontWeight: 600,
            color: "var(--joy-purple)",
            marginBottom: 10
          }}>
            Choose Your Avatar
          </label>
                    {/* Upload Custom Photo Option */}
          <div style={{
            padding: 15,
            background: "var(--gray-lightest)",
            borderRadius: 8,
            marginBottom: 15,
            border: selectedAvatar === "custom" ? "3px solid var(--joy-teal)" : "2px solid transparent"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <label style={{
                flex: 1,
                padding: "10px 16px",
                background: "var(--gradient-sunset)",
                color: "white",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "0.95rem"
              }}>
                📸 Upload Your Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              {customImagePreview && (
                <div style={{ position: "relative" }}>
                  <img
                    src={customImagePreview}
                    alt="Preview"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid var(--joy-teal)"
                    }}
                  />
                  <button
                    onClick={() => {
                      setCustomImage(null);
                      setCustomImagePreview(null);
                      setSelectedAvatar("");
                    }}
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-medium)", marginTop: 8 }}>
              Max 5MB • JPG, PNG, GIF • Will be resized to 200x200px
            </div>
          </div>
          
          <div style={{ textAlign: "center", color: "var(--gray-medium)", fontSize: "0.9rem", marginBottom: 10 }}>
            — OR choose an emoji avatar —
          </div>
                    {/* Category Tabs */}
          <div style={{ 
            display: "flex", 
            gap: 8, 
            marginBottom: 15,
            overflowX: "auto",
            paddingBottom: 8
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  background: selectedCategory === cat ? "var(--gradient-ocean)" : "var(--gray-lightest)",
                  color: selectedCategory === cat ? "white" : "var(--gray-dark)",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Avatar Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            gap: 10,
            padding: 15,
            background: "var(--gray-lightest)",
            borderRadius: 8,
            maxHeight: 300,
            overflowY: "auto"
          }}>
            {getCategoryAvatars(selectedCategory).map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                title={avatar.name}
                style={{
                  padding: 10,
                  background: selectedAvatar === avatar.id ? "var(--joy-teal-light)" : "white",
                  border: selectedAvatar === avatar.id ? "3px solid var(--joy-teal)" : "2px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: "2rem",
                  transition: "all 0.2s ease",
                  aspectRatio: "1"
                }}
              >
                {avatar.display}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {displayName && selectedAvatar && (
          <div style={{
            padding: 15,
            background: "var(--joy-teal-light)",
            borderRadius: 8,
            marginBottom: 20,
            border: "2px solid var(--joy-teal)"
          }}>
            <div style={{ fontSize: "0.85rem", color: "var(--gray-dark)", marginBottom: 8 }}>
              Preview:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {selectedAvatar === "custom" && customImagePreview ? (
                <img
                  src={customImagePreview}
                  alt="Avatar"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div style={{ fontSize: "2.5rem" }}>
                  {avatarOptions.find(a => a.id === selectedAvatar)?.display}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, color: "var(--joy-teal)", fontSize: "1.1rem" }}>
                  {displayName}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--gray-medium)" }}>
                  This is how you'll appear in chat
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              background: "white",
              color: "var(--gray-dark)",
              border: "2px solid var(--gray-light)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!displayName.trim() || !selectedAvatar || uploading}
            style={{
              flex: 2,
              padding: 12,
              background: displayName.trim() && selectedAvatar && !uploading
                ? "var(--gradient-ocean)" 
                : "var(--gray-light)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: displayName.trim() && selectedAvatar && !uploading ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: 600,
              opacity: displayName.trim() && selectedAvatar && !uploading ? 1 : 0.5
            }}
          >
            {uploading ? "⏳ Uploading..." : "✓ Join Chat"}
          </button>
        </div>

        <p style={{ 
          fontSize: "0.8rem", 
          color: "var(--gray-medium)", 
          marginTop: 15,
          marginBottom: 0,
          textAlign: "center"
        }}>
          🔒 Your real identity remains private. Only your chosen name and avatar are visible.
        </p>
      </div>
    </div>
  );
}
