// Profile update event system
// This allows components to listen for profile updates and refresh accordingly
//app/src/lib/profileUpdateManager.ts
type ProfileUpdateListener = () => void;

class ProfileUpdateManager {
    private listeners: Set<ProfileUpdateListener> = new Set();

    subscribe(listener: ProfileUpdateListener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }
}

export const profileUpdateManager = new ProfileUpdateManager();

// Call this after updating profile
export const notifyProfileUpdate = () => {
    profileUpdateManager.notify();
};
