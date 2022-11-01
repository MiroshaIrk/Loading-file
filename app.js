import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { upload } from './upload.js';

const firebaseConfig = {
  apiKey: "AIzaSyB_dhtwkgHI2OT-zkimemEwLDuSrZC2P9I",
  authDomain: "frontend-upload-97978.firebaseapp.com",
  projectId: "frontend-upload-97978",
  storageBucket: "frontend-upload-97978.appspot.com",
  messagingSenderId: "190311806349",
  appId: "1:190311806349:web:f9e7423bdd7f07b85e79c4"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
        const block = blocks[index].querySelector('.preview-info-progress');
        block.textContent = percentage;
        block.style.width = percentage;
      }, error => {
        console.log(error);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          console.log('Download URL:', url);
        });
      });
    });
  },
});