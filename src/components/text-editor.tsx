import { useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import { setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import "../App.css";
import { throttle } from "lodash";

export const TextEditor = () => {
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isLocalChange = useRef(false);

  const documentRef = doc(db, "documents", "sample-doc");

  const saveContent = throttle(() => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log("Saving content to db:", content);

      setDoc(documentRef, { content: content.ops }, { merge: true })
        .then(() => console.log("Content saved"))
        .catch(console.error);

      isLocalChange.current = false;
    }
  }, 1000);

  useEffect(() => {
    if (!quillRef.current) return;

    // Load initial content
    getDoc(documentRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const savedContent = docSnap.data()?.content;
          if (savedContent) quillRef.current.getEditor().setContents(savedContent);
        } else {
          console.log("No document found, starting with empty editor.");
        }
      })
      .catch(console.error);

    // Listen to Firestore updates
    const unsubscribe = onSnapshot(
      documentRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        const newContent = snapshot.data()?.content;
        if (!isEditing && newContent) {
          const editor = quillRef.current.getEditor();
          const cursor = editor.getSelection()?.index || 0;
          editor.setContents(newContent, "silent");
          editor.setSelection(cursor);
        }
      },
      (error) => console.error("Snapshot error:", error)
    );

    // Listen for local text changes
    const editor = quillRef.current.getEditor();
    editor.on(
      "text-change",
      (_delta: any, _oldDelta: any, source: "user" | "api" | "silent") => {
        if (source === "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();
          setTimeout(() => setIsEditing(false), 5000);
        }
      }
    );

    return () => unsubscribe(); // ✅ cleanup listener
  }, []);

  return (
    <div className="google-doxs-editor">
      <ReactQuill ref={quillRef} placeholder="Type here..." />
    </div>
  );
};
