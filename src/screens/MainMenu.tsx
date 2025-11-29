import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-260)).current;

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: open ? -260 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const handleNavigate = (screen: string) => {
    toggleMenu();
    onNavigate(screen);
  };

  return (
    <View style={styles.wrapper}>
      {/* Botón hamburguesa */}
      <TouchableOpacity style={styles.hamburger} onPress={toggleMenu}>
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </TouchableOpacity>

      {/* Menú lateral */}
      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        <Text style={styles.menuTitle}>Navigation</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("Home")}
        >
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("Profile")}
        >
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("Products")}
        >
          <Text style={styles.menuText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("Settings")}
        >
          <Text style={[styles.menuText, { color: "#007BFF" }]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("Logout")}
        >
          <Text style={[styles.menuText, { color: "#ff0000ff" }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  hamburger: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 30,
  },
  bar: {
    width: 35,
    height: 4,
    backgroundColor: "#f4ececff",
    borderRadius: 4,
    marginVertical: 3,
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#1a1a1a",
    paddingTop: 120,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4ececff",
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  menuText: {
    fontSize: 16,
    color: "#cccccc",
  },
});