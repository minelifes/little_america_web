import AccountPageLayout from "../components/account/AccountPageLayout";
import SettingsForm from "../components/account/SettingsForm";

// NOT ported from Dart — full account/settings page matching the reference
// screenshots (replaces the drawer's minimal "Налаштування" row for this
// section — see AccountScreen).
export default function AccountSettingsPage() {
  return (
    <AccountPageLayout active="settings">
      <SettingsForm />
    </AccountPageLayout>
  );
}
