import React from "react"
import SuggestionInput from "../SuggestionInput"
import styles from "./App.sass"

// функция запроса подсказок названий городов
async function fetchCity(query) {
  const resp = await fetch(
    `${process.env.API_URL}?limit=10&contentType=city&query=${query}`
  )

  if (!resp.ok) {
    throw new Error(`Ошибка сети: ${resp.statusText}`)
  }

  const data = await resp.json()

  return data?.result?.map((city) => ({ value: city.name })) ?? []
}

export function App() {
  return (
    <section className={styles.App}>
      <h1 className={styles.App_header}>Тестовое задание для Влад АЙТИ</h1>
      <SuggestionInput
        label="Город"
        className={styles.App_input}
        fetchSuggestions={fetchCity}
      />
    </section>
  )
}
