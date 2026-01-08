export default function ProfileCard({ user, onLogout }) {
  return (
    <div className="profile-card glow">
      <h3>Profile</h3>
      <p className="profile-email">{user.email}</p>
      <p className="profile-note">
        You are signed in. Your saved resources are synced to this account.
      </p>
      <button className="profile-logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
