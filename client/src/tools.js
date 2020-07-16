import { db, auth, mode } from "./database";

export { auth, db, mode };
export const DATE_FORMAT = "YYYY-MM-DD";

export const fetchDoc = limitCalls(function fetchDoc(path) {
  return db
    .doc(path)
    .get()
    .then((doc) => doc.data());
});

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
