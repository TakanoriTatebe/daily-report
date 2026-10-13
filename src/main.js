// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "[REMOVED]",
  authDomain: "[REMOVED]",
  projectId: "[REMOVED]",
  storageBucket: "[REMOVED]",
  messagingSenderId: "[REMOVED]",
  appId: "[REMOVED]",
};

const app = initializeApp(firebaseConfig);

// Cloud Firestoreの初期化
const db = getFirestore(app);

// Cloud Firestoreから取得したデータを表示する
const fetchHistoryData = async () => {
  let tags = "";

  // reportsコレクションのデータを取得
  const querySnapshot = await getDocs(collection(db, "reports"));

  // 取得したデータをテーブルの形式に合わせてHTMLに挿入
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());

    tags += `<tr>
      <td>${doc.data().date}</td>
      <td>${doc.data().name}</td>
      <td>${doc.data().work}</td>
      <td>${doc.data().comment}</td>
    </tr>`;
  });

  const history = document.getElementById("js-history");

  if (history) {
    history.innerHTML = tags;
  }
};

// Cloud Firestoreから取得したデータを表示する
if (document.getElementById("js-history")) {
  fetchHistoryData();
}

// Cloud Firestoreにデータを送信する
const submitData = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const docRef = await addDoc(collection(db, "reports"), {
      date: new Date(),
      name: formData.get("name"),
      work: formData.get("work"),
      comment: formData.get("comment"),
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
};

// フォーム送信イベントを設定する
if (document.getElementById("js-form")) {
  document
    .getElementById("js-form")
    .addEventListener("submit", (e) => submitData(e));
}
