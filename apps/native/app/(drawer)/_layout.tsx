import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback } from "react";
import type { ColorValue } from "react-native";
import { Pressable, Text } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";

const HomeDrawerIcon = ({
  size,
  color,
  focused,
}: {
  size: number;
  color: ColorValue;
  focused: boolean;
}) => {
  const themeColorForeground = useThemeColor("foreground");
  // SAFETY: Ionicons supports string or ColorValue at runtime
  const iconColor = (focused ? color : themeColorForeground) as string;
  return <Ionicons name="home-outline" size={size} color={iconColor} />;
};

const HomeDrawerLabel = ({
  color,
  focused,
}: {
  color: ColorValue;
  focused: boolean;
}) => {
  const themeColorForeground = useThemeColor("foreground");
  return (
    <Text style={{ color: focused ? color : themeColorForeground }}>Home</Text>
  );
};

const TabsDrawerIcon = ({
  size,
  color,
  focused,
}: {
  size: number;
  color: ColorValue;
  focused: boolean;
}) => {
  const themeColorForeground = useThemeColor("foreground");
  // SAFETY: MaterialIcons supports string or ColorValue at runtime
  const iconColor = (focused ? color : themeColorForeground) as string;
  return <MaterialIcons name="border-bottom" size={size} color={iconColor} />;
};

const TabsDrawerLabel = ({
  color,
  focused,
}: {
  color: ColorValue;
  focused: boolean;
}) => {
  const themeColorForeground = useThemeColor("foreground");
  return (
    <Text style={{ color: focused ? color : themeColorForeground }}>Tabs</Text>
  );
};

const TabsHeaderRight = () => {
  const themeColorForeground = useThemeColor("foreground");
  return (
    <Link href="/modal" asChild>
      <Pressable className="mr-4">
        <Ionicons name="add-outline" size={24} color={themeColorForeground} />
      </Pressable>
    </Link>
  );
};

const DrawerLayout = () => {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: themeColorBackground },
        headerRight: renderThemeToggle,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerIcon: HomeDrawerIcon,
          drawerLabel: HomeDrawerLabel,
          headerTitle: "Home",
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerIcon: TabsDrawerIcon,
          drawerLabel: TabsDrawerLabel,
          headerRight: TabsHeaderRight,
          headerTitle: "Tabs",
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
