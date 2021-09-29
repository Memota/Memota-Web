import { api } from "boot/axios"
import { useQuasar } from "quasar"

export function saveFile(data: Blob, fileName: string) {
  const fileURL = window.URL.createObjectURL(new Blob([data]))
  const fileLink = document.createElement("a")

  fileLink.href = fileURL
  fileLink.setAttribute("download", fileName)
  document.body.appendChild(fileLink)

  //simulate click on "a"
  fileLink.click()
}

export async function downloadFile(url: string, fileName: string) {
  const jwt: string = localStorage.getItem("jwt") || ""
  try {
    await api
      .get(url, {
        headers: { Authorization: "Bearer " + jwt },
        responseType: "blob",
      })
      .then((response) => {
        saveFile(response.data, fileName)
      })
  } catch (err) {
    useQuasar().notify({
      color: "negative",
      position: "top",
      message: "Something went wrong",
      icon: "report_problem",
    })
  }
}
