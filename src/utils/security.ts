import { enc } from "crypto-js"
import { Note } from "src/store/note/state"
import CryptoJS from "crypto-js"

export class NoteSecurity {
  static prefix = "secured"

  public static encryptText(text: string, password: string): string {
    // encrypt using AES
    console.log("encrypting: " + text + " using " + password)
    const encryptedText = CryptoJS.AES.encrypt(NoteSecurity.prefix + text, password).toString()
    return encryptedText
  }

  public static decryptContent(note: Note, password: string): string {
    // decrypt using AES
    console.log("decrypting: " + note.text + " using: " + password)
    const decryptedBytes = CryptoJS.AES.decrypt(note.text, password)
    console.log("bytes: ")
    console.log(decryptedBytes)
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8)

    // detect if the password was correct
    if (!decryptedText.startsWith(NoteSecurity.prefix)) {
      throw new Error("wrong password")
    }

    return decryptedText.substr(NoteSecurity.prefix.length)
  }
}
