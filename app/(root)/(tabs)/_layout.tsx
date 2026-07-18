import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* 1 */}
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>

      {/* 2 */}
      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      {/* 3 */}
      <NativeTabs.Trigger name="saved">
        <Icon sf="bookmark.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      {/* 4 */}
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.circle" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
