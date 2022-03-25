import React, { useState, useCallback, useMemo, useRef } from "react"
import PropTypes from "prop-types"
import debounce from "debounce"
import classNames from "classnames/bind"
import styles from "./SuggestionInput.sass"

const cx = classNames.bind(styles)

export function SuggestionInput({
  // начальное значение
  value = "",
  // подпись поля ввода
  label: labelText,
  className,
  // асинхронная функция запроса подсказок
  fetchSuggestions,
  // минимальное время между запросами подсказок
  debounceWait = 300,
  // коллбек вызывается по каждому изменению значения
  onChange,
  // коллбек вызывается по каждому выбору значения из подсказок
  onSelect,
}) {
  const [state, setState] = useState({
    // текущее значение в поле ввода
    value,
    // загружаем ли предложения
    loading: false,
    // список вариантов ввода
    suggestions: [],
    //
    error: null,
  })

  // ссылка на поле ввода
  const inputRef = useRef()

  // функция запроса подсказок с debounce механизмом
  const fetchSuggestionsDebounced = useMemo(() => {
    // устанавливает новые подсказки, только если подсказки были запрошены
    const setSuggestions = (suggestions) => {
      setState((state) => {
        if (state.loading) {
          return { ...state, loading: false, suggestions }
        }
        return state
      })
    }

    // устанавливает ошибку, только если подсказки были запрошены
    const setError = (error) => {
      console.error(error)

      setState((state) => {
        if (state.loading) {
          return {
            ...state,
            loading: false,
            suggestions: [],
            error: error.message,
          }
        }
        return state
      })
    }

    return debounce((value) => {
      fetchSuggestions(value).then(setSuggestions, setError)
    }, debounceWait)
  }, [fetchSuggestions, debounceWait])

  // устанавливает новое значение value и делает запрос подсказок
  const handleChange = useCallback(
    (event) => {
      const { value } = event.target

      // устанавливаем новое значение и флаг загрузки
      setState((state) => ({
        ...state,
        value,
        loading: true,
      }))

      fetchSuggestionsDebounced(value)
      onChange?.(value)
    },
    [fetchSuggestionsDebounced]
  )

  // устанавливаем новое значение из подсказок и отменяет запрос подсказок
  const handleSelect = useCallback(
    (event) => {
      event.preventDefault()
      const value = event.target.getAttribute("data-value")

      // сбрасываем таймер в debounce, чтобы не делать следующий запрос подсказок
      fetchSuggestionsDebounced.clear()

      // устанавливаем новое value, сбрасываем флаг загрузки, список подсказок и ошибку
      setState((state) => ({
        ...state,
        value,
        loading: false,
        suggestions: [],
        error: null,
      }))

      inputRef.current?.focus()
      onSelect?.(value)
    },
    [fetchSuggestionsDebounced]
  )

  // по нажатию на enter выбираем элемент на котором сейчас фокус
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSelect(event)
      }
    },
    [handleSelect]
  )

  const showSuggestions = state.suggestions.length > 0 || state.loading

  return (
    <div className={cx(className, "SuggestionInput")}>
      {labelText && (
        <label className={styles.SuggestionInput_label}>{labelText}</label>
      )}
      <input
        ref={inputRef}
        className={styles.SuggestionInput_input}
        type="text"
        autoComplete="false"
        value={state.value}
        onChange={handleChange}
      />
      {showSuggestions && (
        <ul
          className={cx("SuggestionInput_options", {
            SuggestionInput_options__loading: state.loading,
          })}
        >
          {state.suggestions.map((suggestion) => (
            <li
              className={styles.SuggestionInput_item}
              key={suggestion.value}
              data-value={suggestion.value}
              onClick={handleSelect}
              onKeyDown={handleKeyPress}
              tabIndex="0"
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
      {state.error && (
        <span className={styles.SuggestionInput_error}>{state.error}</span>
      )}
    </div>
  )
}

SuggestionInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  fetchSuggestions: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  debounceWait: PropTypes.number,
}
