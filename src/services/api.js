const BASE_URL = import.meta.env.VITE_API_URL //questo è l'URL del backend

const BASE_URL = import.meta.env.VITE_API_URL


const getHeaders = () => {// serve per le chiamate che richiedono autenticazione
  const token = localStorage.getItem("token")// Legge il token salvato nel browser
  return {
    "Content-Type": "application/json", //dice al backend che stiamo mandando dati in formato JSON
    ...(token && { Authorization: `Bearer ${token}` }), //se il token esiste, lo aggiunge all'header. Il backend lo legge per sapere chi sei
  }
}

// Autenticazione
export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export function getGoogleAuthUrl() {
  return `${BASE_URL}/api/auth/google`
}

//Articoli
export async function getArticles(category) {//Prende tutti gli articoli. Se passi una categoria (es. "stories") filtra solo quelli di quella categoria. Se non passi niente li prende tutti. La usiamo nella homepage e nella pagina categoria.
  const url = category
    ? `${BASE_URL}/api/articles?category=${category}`
    : `${BASE_URL}/api/articles`
  const response = await fetch(url)
  return response.json()
}

export async function getFeaturedArticles() {//Prende solo gli articoli con isFeatured: true — massimo 4. Li usiamo nella sezione "Scelti da SexyTeller" in homepage.
  const response = await fetch(`${BASE_URL}/api/articles/featured`)
  return response.json()
}

export async function getArticleById(id) {//Prende un singolo articolo tramite il suo _id di MongoDB. La usiamo nella pagina articolo singolo.
  const response = await fetch(`${BASE_URL}/api/articles/${id}`)
  return response.json()
}

export async function createArticle(data) {//Crea un nuovo articolo. Richiede autenticazione (usa getHeaders()). La usiamo nell'editor. data conterrà titolo, categoria, testo ecc.
  const response = await fetch(`${BASE_URL}/api/articles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateArticle(id, data) {//Modifica un articolo esistente. Richiede autenticazione. Solo l'autore può modificare il suo articolo.
  const response = await fetch(`${BASE_URL}/api/articles/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteArticle(id) {//Elimina un articolo. Richiede autenticazione. Solo l'autore può eliminare il suo articolo.
  const response = await fetch(`${BASE_URL}/api/articles/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  return response.json()
}

export async function toggleLikeArticle(id) {//Aggiunge o rimuove il like su un articolo. Richiede autenticazione. Se hai già messo like lo toglie, altrimenti lo aggiunge — lo gestisce tutto il backend.
  const response = await fetch(`${BASE_URL}/api/articles/${id}/like`, {
    method: "POST",
    headers: getHeaders(),
  })
  return response.json()
}

// COMMENTI 

export async function getComments(articleId) {
  const response = await fetch(`${BASE_URL}/api/articles/${articleId}/comments`)
  return response.json()
}

export async function createComment(articleId, data) {
  const response = await fetch(`${BASE_URL}/api/articles/${articleId}/comments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteComment(articleId, commentId) {
  const response = await fetch(`${BASE_URL}/api/articles/${articleId}/comments/${commentId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  return response.json()
}

export async function toggleLikeComment(articleId, commentId) {
  const response = await fetch(`${BASE_URL}/api/articles/${articleId}/comments/${commentId}/like`, {
    method: "POST",
    headers: getHeaders(),
  })
  return response.json()
}

// UTENTI 

export async function getUserProfile(handle) {//la userò nella pagna del profilo utente
  const response = await fetch(`${BASE_URL}/api/users/${handle}`)
  return response.json()
}

export async function getUserArticles(handle) {//la userò nella pagna del profilo utente
  const response = await fetch(`${BASE_URL}/api/users/${handle}/articles`)
  return response.json()
}

export async function updateMe(data) {//la userò nella pagina impostazioni per aggionare il profilo
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteMe() {//per eliminare l'account 
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  return response.json()
}

//con ADMIN - qui non basterà essere loggati ma si dovrà essere della redazione

export async function adminGetUsers() {
  const response = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: getHeaders(),
  })
  return response.json()
}

export async function adminToggleBlock(userId) {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
    method: "PUT",
    headers: getHeaders(),
  })
  return response.json()
}

export async function adminDeleteUser(userId) {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  return response.json()
}

//UPLOAD con Cloudinary 

export async function uploadImage(formData) {
  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,//quando mandiamo un'immagine il body non è JSON, è un FormData. qui il browser deve impostare il Content-Type da solo — NON manualmenteQuindi passiamo solo il token di autenticazione e lasciamo fare al browser il resto
  })
  return response.json()
}