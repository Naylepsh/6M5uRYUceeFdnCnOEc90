import { db, auth, mode } from "./database";
import {
  differenceInDays,
  startOfWeek,
  subDays,
  addDays,
  format as formatDate,
} from "date-fns";

export { auth, db, mode };
export const DATE_FORMAT = "YYYY-MM-DD";

export const fetchDoc = limitCalls(function fetchDoc(path) {
  return db
    .doc(path)
    .get()
    .then((doc) => doc.data());
});

export function onAuthStateChanged(callback) {
  return auth().onAuthStateChanged(callback);
}

export async function signup({
  email,
  password,
  displayName = "No Name",
  photoURL = "https://placekitten.com/200/200",
  startDate,
}) {
  try {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    await user.updateProfile({ displayName, photoURL });
    await db.doc(`users/${user.uid}`).set({
      displayName: displayName,
      uid: user.uid,
      photoURL: photoURL,
      goal: 8000,
      started: formatDate(startDate, DATE_FORMAT),
    });
  } catch (e) {
    throw e;
  }
}

export function sortByCreatedAtDescending(a, b) {
  return b.createdAt - a.createdAt;
}

export function login(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  return auth().signOut();
}

export function isValidDate(year, month, day) {
  return month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year);
}

export function daysInMonth(m, y) {
  switch (m) {
    case 1:
      return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
    case 8:
    case 3:
    case 5:
    case 10:
      return 30;
    default:
      return 31;
  }
}

export function calculateWeeks(posts, startDate, numWeeks) {
  // ends up like [[s, m, t, w, t, f, s], week, week]
  const weeks = [];

  // ends up like: { "2019-03-19": [post, post] }
  const postsByDay = {};
  posts.forEach((post) => {
    if (!postsByDay[post.date]) postsByDay[post.date] = [];
    postsByDay[post.date].push(post);
  });

  const startDay = startOfWeek(subDays(startDate, (numWeeks - 1) * 7));
  let weekCursor = -1;
  Array.from({ length: numWeeks * 7 }).forEach((_, index) => {
    const date = addDays(startDay, index);
    const dayKey = formatDate(date, DATE_FORMAT);
    const posts = postsByDay[dayKey] || [];
    const dayta /*get it?!*/ = { date, posts };
    if (index % 7) {
      weeks[weekCursor].push(dayta);
    } else {
      weeks.push([dayta]);
      weekCursor++;
    }
  });

  return weeks;
}

function limitCalls(fn, limit = 20) {
  let calls = 0;
  return (...args) => {
    calls++;
    if (calls > limit) {
      throw new Error(`You've called "${fn.name}" too many times too quickly.`);
    } else {
      setTimeout(() => (calls = 0), 3000);
    }
    return fn(...args);
  };
}

export const fetchPosts = limitCalls(function fetchPosts(uid) {
  return db
    .collection("posts")
    .orderBy("createdAt")
    .where("uid", "==", uid)
    .get()
    .then(getDocsFromSnapshot);
});

function getDocsFromSnapshot(snapshot) {
  const docs = [];
  snapshot.forEach((doc) => {
    docs.push(getDataFromDoc(doc));
  });
  return docs;
}

function getDataFromDoc(doc) {
  return { ...doc.data(), id: doc.id };
}

export const subscribeToPosts = limitCalls(function subscribeToPosts(
  uid,
  callback
) {
  let collection = db
    .collection("posts")
    .orderBy("createdAt")
    .where("uid", "==", uid);
  return collection.onSnapshot((snapshot) =>
    callback(getDocsFromSnapshot(snapshot))
  );
});

export async function createPost(post) {
  return db
    .collection("posts")
    .add({ createdAt: Date.now(), ...post })
    .then((ref) => ref.get())
    .then((doc) => ({ ...doc.data(), id: doc.id }));
}

export function deletePost(id) {
  return db.doc(`posts/${id}`).delete();
}

export const loadFeedPosts = limitCalls(function loadFeedPosts(
  createdAtMax,
  limit
) {
  return db
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("createdAt", "<", createdAtMax)
    .limit(limit)
    .get()
    .then(getDocsFromSnapshot);
});

export const subscribeToNewFeedPosts = limitCalls(
  function subscribeToNewFeedPosts(createdAtMin, callback) {
    return db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .where("createdAt", ">=", createdAtMin)
      .onSnapshot((snapshot) => {
        callback(getDocsFromSnapshot(snapshot));
      });
  }
);
