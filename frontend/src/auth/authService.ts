import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import app from "./firebase.init";

const auth = getAuth(app);

interface userCredential {
  email: string;
  password: string;
}

const devAdminUIDs: string[] = [];

//create a new admin user with email and password
const registerAdminUser = async (userCredential: userCredential) => {
  try {
    const newAdminUser = await createUserWithEmailAndPassword(
      auth,
      userCredential.email,
      userCredential.password
    );
    // Add to admin array if is admin
    devAdminUIDs.push(newAdminUser.user.uid);
    sessionStorage.setItem("adminUID", newAdminUser.user.uid);
    setTimeout(() => {}, 3000);
    console.log("New admin user created with:", newAdminUser.user.email);
    console.log("Admin UID added to devAdminUIDs:", devAdminUIDs);
    return newAdminUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new admin user:", error.message);
    }
  }
};

// Get token claims of the admin user
const getAdminTokenClaims = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    const tokenResult = await user.getIdTokenResult(true);
    return tokenResult.claims;
  } catch (error) {
    console.error("Error fetching token claims:", error);
  }
};

// Check if the user is admin
const isAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;
  const claims = await getAdminTokenClaims();
  console.log("Admin claims:", claims);
  if (claims?.admin) return true;
  return devAdminUIDs.includes(user.uid);
};

// create a new student user with email and password
const createUser = async (userCredential: userCredential) => {
  try {
    const password = await validatePassword(auth, userCredential.password);
    if (!password.isValid) {
      const needsLowerCase = password.containsLowercaseLetter !== true;
      const needsUpperCase = password.containsUppercaseLetter !== true;
      throw new Error(
        `Password validation failed. Missing: ${
          needsLowerCase ? "lowercase letter " : ""
        }${needsUpperCase ? "uppercase letter" : ""}`.trim()
      );
    }
    const newUser = await createUserWithEmailAndPassword(
      auth,
      userCredential.email,
      userCredential.password
    );
    return newUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new user:", error.message);
    }
  }
};

// sign in an existing user student with email and password
const signInUser = async (userCredential: userCredential) => {
  try {
    const existingUser = await signInWithEmailAndPassword(
      auth,
      userCredential.email,
      userCredential.password
    );
    console.log("User signed in:", existingUser.user.email);
    return existingUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error signing in user:", error.message);
    }
  }
};

// retrieve idToken of the current studentuser
const getIdToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      //throw new Error("No user is currently signed in.");
      console.log("No user is signed in");
      return;
    }
    const idToken = await currentUser.getIdToken();
    return idToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error retrieving id token:", error.message);
    }
  }
};

// sign out the current user
const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("User signed out successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error signing out user:", error.message);
    }
  }
};
export {
  createUser,
  signInUser,
  signOutUser,
  getIdToken,
  registerAdminUser,
  isAdmin,
  getAdminTokenClaims,
};
