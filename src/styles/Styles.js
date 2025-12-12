// src/styles.js
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const colors = {
  primary: "#03737D",      // teal
  secondary: "#666",       // grey
  accent: "#fff",          // white
  background: "#f9f9f9",
  lightGray: "#e0e0e0",
  shadow: "rgba(0,0,0,0.2)",
};

export const s = StyleSheet.create({
  // ================= Splash =================
  splashContainer: { flex: 1 },
  splashImage: { width, height },

  // ================= Onboarding =================
  onboard: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  slide: { alignItems: "center", justifyContent: "center", padding: 20 },
  imageContainer: {
    width: 220,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: colors.lightGray,
  },
  onboardImage: { width: "100%", height: "100%" },
  onboardTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  onboardText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: "center",
    marginHorizontal: 10,
  },
dotsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 16,
  marginBottom: 12
},

dot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},

dotInactive: {
  backgroundColor: '#ccc',
},

dotActive: {
  backgroundColor: colors.primary,
  // optional: make active dot slightly wider (pill-shaped)
  width: 10,
  height: 10,
  borderRadius: 5,
},

  
  primaryBtnText: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 16,
  },
  textBtn: { alignItems: "center", padding: 10 },
  textBtnText: {
    color: colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
    paddingVertical: 30,
  },

  // ================= Auth (SignIn / SignUp) =================
  authContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fdfdfd",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  footerText: { fontSize: 14, color: "#666" },
  footerLink: { fontSize: 14, color: colors.primary, fontWeight: "600" },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  switchText: {
    textAlign: "center",
    fontSize: 15,
    color: "#444",
    paddingVertical: 15,
  },
  switchLink: { color: colors.primary, fontWeight: "600" },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
    color: "#666",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
export default s;
