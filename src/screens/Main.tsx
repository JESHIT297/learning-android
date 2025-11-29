import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import MainMenu from "./MainMenu";
import Profile from "./Profile";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

interface MainProps {
  user?: {
    firstname: string;
    lastname: string;
    email: string;
    mobile_number: string;
  };
  onLogout?: () => void;
}

export default function Main({ user, onLogout }: MainProps) {
  const [screen, setScreen] = useState<string>("Home");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleNavigate = (selectedScreen: string) => {
    if (selectedScreen === "Logout") {
      onLogout?.();
      return;
    }
    setScreen(selectedScreen);
    if (selectedScreen === "Products") {
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Menú hamburguesa */}
      <MainMenu onNavigate={handleNavigate} />

      {/* Contenido principal */}
      {screen === "Products" ? (
        loading ? (
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.list}
            style={{ flex: 1 }}
          />
        )
      ) : screen === "Profile" ? (
        <Profile user={user} />
      ) : (
        <View style={styles.home}>
          <Text style={styles.homeText}>Welcome to {screen}</Text>
        </View>
      )}

      {/* Modal de producto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedProduct.description}
                </Text>
                <Text style={styles.modalPrice}>
                  ${selectedProduct.price.toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => alert("Producto agregado al carrito 🛒")}
                >
                  <Text style={styles.addButtonText}>🛒 Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeText: {
    color: "#f4ececff",
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    color: "#f4ececff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  price: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#f4ececff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    color: "#cccccc",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  modalPrice: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#f4ececff",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: "#ff0000ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "#f4ececff",
    fontWeight: "bold",
    fontSize: 14,
  },
});