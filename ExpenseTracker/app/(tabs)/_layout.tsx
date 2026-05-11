import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import {
  Platform,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const BLUE = "#3B5BDB";
const INACTIVE = "#94A3B8";
const BAR_H = 64;
const FAB_SIZE = 56;
const FAB_RISE = FAB_SIZE / 2;
const NR = FAB_SIZE / 2 + 10;

const LEFT_TABS = [
  { name: "index", label: "Home", icon: "home-outline", iconActive: "home" },
  { name: "wallet", label: "Wallet", icon: "layers-outline", iconActive: "layers" },
];
const RIGHT_TABS = [
  { name: "goals", label: "Goals", icon: "flag-outline", iconActive: "flag" },
  { name: "profile", label: "Profile", icon: "person-outline", iconActive: "person" },
];

function WhiteBar({ width, backgroundColor }: { width: number; backgroundColor: string }) {
  const cx = width / 2;
  const d = [
    `M 0 0`,
    `L ${cx - NR - 16} 0`,
    `C ${cx - NR - 2} 0 ${cx - NR} ${10} ${cx - NR} ${NR}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${NR}`,
    `C ${cx + NR} ${10} ${cx + NR + 2} 0 ${cx + NR + 16} 0`,
    `L ${width} 0`,
    `L ${width} ${BAR_H}`,
    `L 0 ${BAR_H}`,
    `Z`,
  ].join(" ");
  return (
    <Svg width={width} height={BAR_H} style={StyleSheet.absoluteFill}>
      <Path d={d} fill={backgroundColor} />
    </Svg>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const safeBottom = Math.max(bottomInset, Platform.OS === "android" ? 16 : 0);
  const barBackground = "#FFFFFF";
  const totalHeight = BAR_H + FAB_RISE + safeBottom;

  const renderTab = (tab: (typeof LEFT_TABS)[0]) => {
    const idx = state.routes.findIndex((r) => r.name === tab.name);
    const isFocused = state.index === idx;
    const route = state.routes[idx];
    if (!route) return null;
    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(tab.name);
    };
    return (
      <TouchableOpacity
        key={tab.name}
        style={s.tabItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[s.label, { color: isFocused ? BLUE : INACTIVE }]}>
          {tab.label}
        </Text>
        <Ionicons
          name={(isFocused ? tab.iconActive : tab.icon) as any}
          size={24}
          color={isFocused ? BLUE : INACTIVE}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.wrapper, { height: totalHeight, backgroundColor: barBackground }]}>
      <WhiteBar width={width} backgroundColor={barBackground} />
      <View style={s.shadowLayer} />
      <View style={[s.tabRow, { bottom: safeBottom }]}>
        <View style={s.side}>{LEFT_TABS.map(renderTab)}</View>
        <View style={{ width: FAB_SIZE + 20 }} />
        <View style={s.side}>{RIGHT_TABS.map(renderTab)}</View>
      </View>
      <View style={s.fabPos} pointerEvents="box-none">
        <TouchableOpacity
          style={s.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("add-expense")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="goals" options={{ title: "Goals" }} />
      <Tabs.Screen name="goals/create" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="add-expense" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="all-transactions" options={{ href: null }} />
      <Tabs.Screen name="select-category" options={{ href: null }} />
      <Tabs.Screen name="create-category" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  shadowLayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_H,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  tabRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_H,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 12,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  fabPos: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BLUE,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
});
