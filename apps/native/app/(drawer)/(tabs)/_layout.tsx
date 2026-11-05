import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import type { ColorValue } from "react-native";

const HomeTabBarIcon = ({
  color,
  size,
}: {
  color: ColorValue;
  size: number;
}) => (
  <Ionicons name="home" size={size} color={color ? String(color) : undefined} />
);

const TwoTabBarIcon = ({
  color,
  size,
}: {
  color: ColorValue;
  size: number;
}) => (
  <Ionicons
    name="compass"
    size={size}
    color={color ? String(color) : undefined}
  />
);

const TabLayout = () => {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themeColorBackground,
        },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: HomeTabBarIcon,
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: TwoTabBarIcon,
          title: "Explore",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
