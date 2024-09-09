import { redirect } from "next/navigation";
import React from "react";
import { ProfileForm } from "./_components/profile-form";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import SettingsSubSection from "./_components/settings-sub-section";
import { ChangePasswordForm } from "./_components/change-password-form";

type Props = {};

const ProfileSettings = async (props: Props) => {
  const user = await currentUser();
  if (!user) redirect("/signin");
  return (
    <div className="w-full h-full flex flex-col items-center py-4 gap-4 relative">
      <SettingsSubSection heading="Profile" subheading="Mange your profile" />
      <SettingsSubSection className="gap-4">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center">
            <Avatar className="h-40 w-40">
              <AvatarFallback className="text-4xl uppercase">
                {user.name?.split("")[0] || "NA"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <ProfileForm user={user} />
          </div>
        </div>
      </SettingsSubSection>
      <SettingsSubSection
        heading="Change password"
        subheading="update your password here"
      />
      <SettingsSubSection className="gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <ChangePasswordForm user={user} />
          </div>
        </div>
      </SettingsSubSection>
    </div>
  );
};

export default ProfileSettings;
