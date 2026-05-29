import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFqxrchpVlqiAIY379TOeol6QJ-NzY8rw",
  authDomain: "draft-it-b795a.firebaseapp.com",
  projectId: "draft-it-b795a",
  storageBucket: "draft-it-b795a.firebasestorage.app",
  messagingSenderId: "644762191275",
  appId: "1:644762191275:web:f7f9bac9e84323c6373eee",
  measurementId: "G-D438JCDBDR",
};

const adminEmail = "illasuryanani2001@gmail.com";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

isAnalyticsSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

let currentUser = null;
let currentIsAdmin = false;

function emitAuthState() {
  window.dispatchEvent(new CustomEvent("draftit-cloud-auth", {
    detail: {
      user: currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
      } : null,
      isAdmin: currentIsAdmin,
    },
  }));
}

function assertAdmin() {
  if (!currentUser || !currentIsAdmin) {
    throw new Error("Cloud sync is available only for the Draft It admin account.");
  }
}

function projectDocument(projectId) {
  return doc(db, "adminCloud", currentUser.uid, "projects", projectId);
}

async function signInAdmin({ redirectToApp = false } = {}) {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithPopup(auth, provider);
  const email = credential.user.email || "";
  if (email.toLowerCase() !== adminEmail) {
    await signOut(auth);
    throw new Error("This Google account is not allowed to use Draft It cloud sync.");
  }
  if (redirectToApp) window.location.href = "/";
  return credential.user;
}

async function syncProject(payload) {
  assertAdmin();
  const project = payload?.project;
  if (!project?.id) throw new Error("No project selected for cloud sync.");

  await setDoc(projectDocument(project.id), {
    ...payload,
    projectId: project.id,
    title: project.title || "Untitled Project",
    author: project.author || "",
    updatedAt: serverTimestamp(),
  });
}

async function listProjects() {
  assertAdmin();
  const projectsRef = collection(db, "adminCloud", currentUser.uid, "projects");
  const snapshot = await getDocs(query(projectsRef, orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function signOutAdmin() {
  await signOut(auth);
}

function getCloudErrorMessage(error) {
  if (error?.code === "auth/configuration-not-found") {
    return [
      "Firebase Auth is not enabled/configured for this project yet.",
      "",
      "Open Firebase Console > Authentication > Sign-in method, then enable Google sign-in for draft-it-b795a.",
      "Also make sure localhost and draft-it.vercel.app are in Authentication > Settings > Authorized domains.",
    ].join("\n");
  }

  if (error?.code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Authentication. Add it in Firebase Console > Authentication > Settings > Authorized domains.";
  }

  return error?.message || "Could not sign in to Draft It cloud sync.";
}

window.draftItCloud = {
  adminEmail,
  isAdmin: () => currentIsAdmin,
  getUser: () => currentUser,
  signInAdmin,
  signOutAdmin,
  syncProject,
  listProjects,
};

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  currentIsAdmin = (user?.email || "").toLowerCase() === adminEmail;
  emitAuthState();
});

document.querySelector("#admin-cloud-login")?.addEventListener("click", async () => {
  try {
    await signInAdmin({ redirectToApp: true });
  } catch (error) {
    alert(getCloudErrorMessage(error));
  }
});
