import { db, auth, mode } from "./db.fake";

import { startOfWeek, subDays, addDays, format as formatDate } from "date-fns";

export { auth, db, mode };

export const DATE_FORMAT = "YYYY-MM-DD";

export function login(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  return auth().signOut();
}

export function onAuthStateChanged(callback) {
  return auth().onAuthStateChanged(callback);
}

//Function to create user profiles
//with some default informations

export async function signup({
  email,
  password,
  displayName = "No Name",
  startDate,
}) {
  try {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    await user.updateProfile({ displayName });
    await db.doc(`users/${user.uid}`).set({
      displayName: displayName,
      uid: user.uid,
      started: formatDate(startDate, DATE_FORMAT),
    });
  } catch (e) {
    throw e;
  }
}

//Some functions for getting
//data from database and providing
//integration between UI and db

export const fetchUser = limitCalls(async function fetchUser(uid) {
  return fetchDoc(`users/${uid}`);
});

export const fetchDoc = limitCalls(function fetchDoc(path) {
  return db
    .doc(path)
    .get()
    .then((doc) => doc.data());
});

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

export const fetchPosts = limitCalls(function fetchPosts(uid) {
  return db
    .collection("posts")
    .orderBy("createdAt")
    .where("uid", "==", uid)
    .get()
    .then(getDocsFromSnapshot);
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

export const getPosts = limitCalls(function getPosts(uid) {
  return db
    .collection("posts")
    .orderBy("createdAt")
    .where("uid", "==", uid)
    .get()
    .then(getDocsFromSnapshot);
});

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

export const subscribeToFeedPosts = limitCalls(function subscribeToFeedPosts(
  createdAtMax,
  limit,
  callback
) {
  return db
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("createdAt", "<", createdAtMax)
    .limit(limit)
    .onSnapshot((snapshot) => callback(getDocsFromSnapshot(snapshot)));
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

export { formatDate };

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

export function isValidDate(year, month, day) {
  return month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year);
}

export function sortByCreatedAtDescending(a, b) {
  return b.createdAt - a.createdAt;
}

export function calculateWeeks(posts, startDate, numWeeks) {
  //provides data for Calendar component
  const weeks = [];

  const postsByDay = {};
  posts.forEach((post) => {
    if (!postsByDay[post.date]) postsByDay[post.date] = [];
    postsByDay[post.date].push(post);
  });

  const startDay = startOfWeek(subDays(startDate, (numWeeks - 5) * 7), {
    weekStartsOn: 1,
  });
  let weekCursor = -1;
  Array.from({ length: numWeeks * 7 }).forEach((_, index) => {
    const date = addDays(startDay, index);
    const dayKey = formatDate(date, DATE_FORMAT);
    const posts = postsByDay[dayKey] || [];
    const dayta = { date, posts };
    if (index % 7) {
      weeks[weekCursor].push(dayta);
    } else {
      weeks.push([dayta]);
      weekCursor++;
    }
  });

  return weeks;
}

function getDataFromDoc(doc) {
  return { ...doc.data(), id: doc.id };
}

function getDocsFromSnapshot(snapshot) {
  const docs = [];
  snapshot.forEach((doc) => {
    docs.push(getDataFromDoc(doc));
  });
  return docs;
}

const easeOut = (progress) => Math.pow(progress - 1, 5) + 1;

export function tween(duration, callback) {
  //necessary in animation components
  let start = performance.now();
  let elapsed = 0;
  let frame;

  const tick = (now) => {
    elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = easeOut(progress);
    if (progress < 1) {
      callback(value);
      frame = requestAnimationFrame(tick);
    } else {
      callback(value, true);
    }
  };

  frame = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frame);
}

//Provides polish translations of dates

export function translateMonths(month) {
  switch (month) {
    case "Jan":
      return "STYCZEŃ";
    case "Feb":
      return "LUTY";
    case "Mar":
      return "MARZEC";
    case "Apr":
      return "KWIECIEŃ";
    case "May":
      return "MAJ";
    case "Jun":
      return "CZERWIEC";
    case "Jul":
      return "LIPIEC";
    case "Aug":
      return "SIERPIEŃ";
    case "Sep":
      return "WRZESIEŃ";
    case "Oct":
      return "PAŹDZIERNIK";
    case "Nov":
      return "LISTOPAD";
    case "Dec":
      return "GRUDZIEŃ";
    default:
      console.log(`Error, can't figure what ${month} is `);
  }
}

export function translateWeekdays(day) {
  switch (day) {
    case "Monday":
      return "poniedziałek";
    case "Tuesday":
      return "wtorek";
    case "Wednesday":
      return "środa";
    case "Thursday":
      return "czwartek";
    case "Friday":
      return "piątek";
    case "Saturday":
      return "sobota";
    case "Sunday":
      return "niedziela";
    default:
      console.log(`Error, can't figure what ${day} is`);
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
