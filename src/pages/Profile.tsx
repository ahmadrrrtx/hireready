// ============================================================
// PAGE: USER PROFILE
// Profile settings and account management
// ============================================================

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { CAREER_PATHS, POPULAR_SKILLS } from '../config/constants';

const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    targetRole: profile?.targetRole || '',
    yearsExperience: profile?.yearsExperience || 0,
    primarySkills: profile?.primarySkills || [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been saved successfully.',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      primarySkills: prev.primarySkills.includes(skill)
        ? prev.primarySkills.filter(s => s !== skill)
        : [...prev.primarySkills, skill],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account and career preferences</p>
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="glass-input w-full"
              />
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Role
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="glass-input w-full"
              >
                <option value="">Select a role...</option>
                {CAREER_PATHS.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Years of Experience: {formData.yearsExperience}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.slice(0, 20).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      formData.primarySkills.includes(skill)
                        ? 'gradient-primary text-white neon-border'
                        : 'glass-hover text-gray-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                variant="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
