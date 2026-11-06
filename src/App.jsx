
import { useEffect, useState } from 'react'
import './App.css'

function useSaved(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default function App() {
  const [page, setPage] = useState('Главная')
  const [theme, setTheme] = useSaved('mp-theme', 'auto')
  const [tasks, setTasks] = useSaved('mp-tasks', [])
  const [notes, setNotes] = useSaved('mp-notes', [])
  const [events, setEvents] = useSaved('mp-events', [])
  const [labels, setLabels] = useSaved('mp-labels', [
  {
    id: 'work',
    name: 'Работа',
    color: '#CFE1FF'
  }
])
const [labelName, setLabelName] = useState('')
const [labelColor, setLabelColor] = useState('#CFE1FF')
  const [taskText, setTaskText] = useState('')
  
const [taskDate, setTaskDate] = useState('')
const [calendarDate, setCalendarDate] = useState(new Date())
const [selectedDate, setSelectedDate] = useState('')
  const [noteText, setNoteText] = useState('')
  const [eventText, setEventText] = useState('')
  const [eventAllDay, setEventAllDay] = useState(true)
const [eventStartTime, setEventStartTime] = useState('09:00')
const [eventEndTime, setEventEndTime] = useState('10:00')
  const [eventDate, setEventDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )

  const tabs = [
    ['Главная', '⌂'],
    ['Календарь', '▦'],
    ['Задачи', '✓'],
    ['Заметки', '▤'],
    ['Настройки', '⚙']
  ]

  function addTask(e) {
    e.preventDefault()
    if (!taskText.trim()) return
    setTasks([...tasks, {
      id: crypto.randomUUID(),
      text: taskText.trim(),
      done: false,
      date: taskDate
    }])
    setTaskText('')
  }

  function addNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return
    setNotes([{
      id: crypto.randomUUID(),
      text: noteText.trim(),
      date: selectedDate
    }, ...notes])
    setNoteText('')
  }

  function addEvent(e) {
    e.preventDefault()
    if (!eventText.trim() || !eventDate) return
    setEvents([...events, {
      id: crypto.randomUUID(),
      text: eventText.trim(),
      date: eventDate,
allDay: eventAllDay,
startTime: eventAllDay ? null : eventStartTime,
endTime: eventAllDay ? null : eventEndTime
    }])
    setEventText('')
  }
function addLabel(e) {
  e.preventDefault()
  if (!labelName.trim()) return

  setLabels([...labels, {
    id: crypto.randomUUID(),
    name: labelName.trim(),
    color: labelColor
  }])

  setLabelName('')
}

function assignLabel(labelId, date) {
  if (!date) return

  setEvents(prev => [
    ...prev,
    {
      id: crypto.randomUUID(),
      date,
      labelId,
      type: 'label'
    }
  ])
}

  const completed = tasks.filter(t => t.done).length

  return (
    <div className="app" data-theme={theme}>
      <div className="shell">
        <header>
          <div className="brand">
            <span className="logo">M</span>
            <span>MyPlanner</span>
          </div>
          <span className="subtitle">Моё пространство</span>
        </header>

        <main>
          {page === 'Главная' && (
            <>
              <div className="hero">
                <p>МОЙ ОРГАНАЙЗЕР</p>
                <h1>Хорошего дня ✨</h1>
                <span>Всё важное в одном месте.</span>
              </div>

              <div className="stats">
                <div className="card">
                  <small>Задачи</small>
                  <strong>{tasks.length - completed}</strong>
                  <span>Осталось выполнить</span>
                </div>
                <div className="card">
                  <small>События</small>
                  <strong>{events.length}</strong>
                  <span>В календаре</span>
                </div>
                <div className="card">
                  <small>Заметки</small>
                  <strong>{notes.length}</strong>
                  <span>Сохранено</span>
                </div>
              </div>
            </>
          )}

          {page === 'Задачи' && (
            <section className="card">
              <h1>Мои задачи</h1>
              <p>Выполнено {completed} из {tasks.length}</p>
              <form onSubmit={addTask} className="form">
                <input
                  placeholder="Новая задача..."
                  value={taskText}
                  onChange={e => setTaskText(e.target.value)}
                />
                <input
  type="date"
  value={taskDate}
  onChange={e => setTaskDate(e.target.value)}
/>
                <button>Добавить</button>
              </form>
{[...tasks].sort((a, b) => {
  if (!a.date && !b.date) return 0
  if (!a.date) return 1
  if (!b.date) return -1
  return a.date.localeCompare(b.date)
}).map(task => (
                <div className="item" key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => setTasks(tasks.map(t =>
                      t.id === task.id
                        ? {...t, done: !t.done}
                        : t
                    ))}
                  />
                  <span className={task.done ? 'done' : ''}>
                    {task.text}
                  </span>
                  {task.date && (
  <small>
    📅 {task.date.split('-').reverse().join('.')}
  </small>
)}
                  <button className="delete" onClick={() =>
                    setTasks(tasks.filter(t => t.id !== task.id))
                  }>×</button>
                </div>
              ))}
            </section>
          )}

          {page === 'Заметки' && (
            <section className="card">
              <h1>Мои заметки</h1>
              <form onSubmit={addNote} className="form vertical">
                <textarea
                  placeholder="Напиши что-нибудь..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                
<input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>

                <button>Сохранить заметку</button>
              </form>
              {notes.map(note => (
                <div className="item" key={note.id}>
                  <span>{note.text}</span>
                  <button className="delete" onClick={() =>
                    setNotes(notes.filter(n => n.id !== note.id))
                  }>×</button>
                </div>
              ))}
            </section>
          )}

          {page === 'Календарь' && (
            <section className="card">
              <h1>Календарь</h1>
<div className="calendar-header">
  <h2>Мой календарь 📅</h2>
  <div className="calendar-nav">
  <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}>❮</button>
  <span>{calendarDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
  <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}>❯</button>
</div>
</div>
<div className="calendar-grid">
  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
    <div key={day} className="calendar-weekday">{day}</div>
  ))}

  {Array.from({
    length: (new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() + 6) % 7
  }, (_, i) => (
    <div key={`empty-${i}`} />
  ))}

  {Array.from({
    length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate()
  }, (_, i) => (
    <button
      type="button"
      key={i}
      className={`calendar-day ${selectedDate === `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}` ? 'selected' : ''}`}
onClick={() => {
  const date = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`

  setEventDate(date)
  setSelectedDate(date)
}}
>
      {i + 1}

{tasks
  .filter(task =>
    task.date === `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
  )
  .map(task => (
    <span
      key={task.id}
      style={{
        display: 'block',
        backgroundColor: '#CFE1FF',
        color: '#111827',
        borderRadius: '4px',
        padding: '2px 4px',
        marginTop: '3px',
        fontSize: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {task.text}
    </span>
  ))}


{notes
  .filter(note =>
    note.date === `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
  )
  .map(note => (
    <span
      key={note.id}
      style={{
        display: 'block',
        backgroundColor: '#FDE68A',
        color: '#111827',
        borderRadius: '4px',
        padding: '2px 4px',
        marginTop: '3px',
        fontSize: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      📝 {note.text}
    </span>
  ))}

{events
  .filter(event =>
    event.type === 'label' &&
    event.date === `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
  )
  .map(event => {
    const label = labels.find(l => l.id === event.labelId)
    if (!label) return null

    return (
      <span
        key={event.id}
        style={{
          display: 'block',
          backgroundColor: label.color,
          color: '#111827',
          borderRadius: '6px',
          padding: '2px 4px',
          marginTop: '3px',
          fontSize: '10px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {label.name}
      </span>
    )
  })}

    </button>
  ))}
</div>
              <form onSubmit={addEvent} className="form vertical">
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                />
                <label>
  <input
    type="checkbox"
    checked={eventAllDay}
    onChange={e => setEventAllDay(e.target.checked)}
  />
  Весь день
</label>

{!eventAllDay && (
  <>
    <label>Начало</label>
    <input
      type="time"
      value={eventStartTime}
      onChange={e => setEventStartTime(e.target.value)}
    />

    <label>Конец</label>
    <input
      type="time"
      value={eventEndTime}
      onChange={e => setEventEndTime(e.target.value)}
    />
  </>
)}
                <input
                  placeholder="Название события"
                  value={eventText}
                  onChange={e => setEventText(e.target.value)}
                />
                <button>Добавить событие</button>
              </form>
              
<h3>Добавить ярлык на дату</h3>

<div className="form vertical">
  <select
    defaultValue=""
    onChange={(e) => {
      if (!e.target.value) return
      assignLabel(e.target.value, eventDate)
      e.target.value = ""
    }}
  >
    <option value="">Выбери ярлык</option>
    {labels.map((label) => (
      <option key={label.id} value={label.id}>
        {label.name}
      </option>
    ))}
  </select>
</div>

              <h3>Задачи на выбранный день</h3>

              {tasks
  .filter(task => task.date === selectedDate)
  .map(task => (
    <div className="item" key={task.id}>
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() =>
            setTasks(tasks.map(t =>
              t.id === task.id
                ? { ...t, done: !t.done }
                : t
            ))
          }
        />
        <span style={{
          textDecoration: task.done ? 'line-through' : 'none'
        }}>
          {task.text}
        </span>
      </label>
    </div>
  ))}
  {[...events]
  .filter(event => event.date === selectedDate)
  .sort((a,b) =>
                a.date.localeCompare(b.date)
              ).map(event => (
                <div className="item" key={event.id}>
                  <span>
  {event.date} — {event.text}
  {' — '}
  {event.allDay === false
    ? `${event.startTime}–${event.endTime}`
    : 'Весь день'}
</span>
                  <button className="delete" onClick={() =>
                    setEvents(events.filter(e => e.id !== event.id))
                  }>×</button>
                </div>
              ))}
              
<h3>Заметки на выбранный день</h3>
{notes
  .filter(note => note.date === selectedDate)
  .map(note => (
    <div className="item" key={note.id}>
      <span>{note.text}</span>
    </div>
  ))}

            </section>
          )}

          {page === 'Настройки' && (
            <section className="card">
              <h1>Оформление</h1>
              <p>Выбери тему приложения</p>
              <div className="theme-options">
                {[
                  ['auto', 'Автоматическая'],
                  ['light', 'Светлая'],
                  ['dark', 'Тёмная']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={theme === value ? 'selected' : ''}
                    onClick={() => setTheme(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
<h2>Мои ярлыки</h2>

<form onSubmit={addLabel} className="form vertical">
  <input
    placeholder="Название ярлыка"
    value={labelName}
    onChange={(e) => setLabelName(e.target.value)}
  />

  <label>
    Цвет ярлыка
    <input
      type="color"
      value={labelColor}
      onChange={(e) => setLabelColor(e.target.value)}
    />
  </label>

  <button type="submit">Создать ярлык</button>
</form>

{labels.map((label) => (
  <div className="item" key={label.id}>
    <span
      style={{
        backgroundColor: label.color,
        color: "#111827",
        padding: "6px 12px",
        borderRadius: "8px"
      }}
    >
      {label.name}
    </span>
  </div>
))}

              <p>Основной цвет: графитовый 🖤</p>
            </section>
          )}
        </main>

        <nav className="navigation">
          {tabs.map(([name, symbol]) => (
            <button
              key={name}
              className={page === name ? 'active' : ''}
              onClick={() => setPage(name)}
            >
              <span className="nav-icon">{symbol}</span>
              <small>{name}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
