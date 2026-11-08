document.querySelector("#year").textContent = new Date().getFullYear();

// Audible library. added: "YYYY-MM" (or "YYYY-MM-DD"), done: finished listening.
const AI_BOOKS = [
  { title: "If Anyone Builds It, Everyone Dies", author: "Eliezer Yudkowsky & Nate Soares", added: "2025-11-11", length: "6h 19m", done: true },
  { title: "The Singularity Is Nearer", author: "Ray Kurzweil", added: "2025-10-27", length: "10h 25m", done: true },
  { title: "Superintelligence", author: "Nick Bostrom", added: "2023-07-22", length: "14h 17m", done: true },
  { title: "Life 3.0", author: "Max Tegmark", added: "2023-07-01", length: "13h 29m", done: true },
  { title: "Human Compatible", author: "Stuart Russell", added: "2023-05-04", length: "11h 38m", done: true },
];

const BOOK_GROUPS = [
  {
    name: "Sci-fi, fantasy & classics",
    books: [
      // Two editions of this one are in the library; both count toward the total.
      { title: "Fahrenheit 451", author: "Ray Bradbury", added: "2026-10-29", copies: 2 },
      { title: "All Quiet on the Western Front", author: "Erich Maria Remarque", added: "2026-05" },
      { title: "The Remains of the Day", author: "Kazuo Ishiguro", added: "2025-09" },
      { title: "Трудно быть богом", author: "Arkady & Boris Strugatsky", added: "2025-07", done: true },
      { title: "Три мушкетера", author: "Alexandre Dumas", added: "2025-06", done: true },
      { title: "Остров сокровищ", author: "Robert Louis Stevenson", added: "2025-06" },
      { title: "The Sparrow", author: "Mary Doria Russell", added: "2024-05" },
      { title: "The Three-Body Problem", author: "Cixin Liu", added: "2024-03" },
      { title: "Mythos", author: "Stephen Fry", added: "2023-09" },
      { title: "Meditations", author: "Marcus Aurelius", added: "2023-09" },
    ],
  },
  {
    name: "History, adventure & science",
    books: [
      { title: "Cosmos", author: "Carl Sagan", added: "2025-10" },
      { title: "The White Darkness", author: "David Grann", added: "2025-03", done: true },
      { title: "The Lost City of Z", author: "David Grann", added: "2025-01", done: true },
      { title: "The Wager", author: "David Grann", added: "2023-09" },
      { title: "Killers of the Flower Moon", author: "David Grann", added: "2023-09" },
      { title: "What It Is Like to Go to War", author: "Karl Marlantes", added: "2023-09", done: true },
    ],
  },
  {
    name: "Health, psychology & self-improvement",
    books: [
      { title: "Why We Sleep", author: "Matthew Walker", added: "2025-08" },
      { title: "7 Rules of Power", author: "Jeffrey Pfeffer", added: "2025-08" },
      { title: "How to Stop Being Toxic", author: "Taylor Blake", added: "2024-12" },
      { title: "Hidden Potential", author: "Adam Grant", added: "2024-03" },
      { title: "Don’t Believe Everything You Think", author: "Joseph Nguyen", added: "2024-03" },
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", added: "2024-03" },
      { title: "How to Talk to Anyone", author: "Leil Lowndes", added: "2024-02", done: true },
      { title: "Outlive", author: "Peter Attia", added: "2023-09" },
      { title: "Talking to Strangers", author: "Malcolm Gladwell", added: "2023-09" },
      { title: "Influencer", author: "Joseph Grenny et al.", added: "2023-09" },
      { title: "Emotional Intelligence", author: "Daniel Goleman", added: "2023-08", done: true },
      { title: "Atomic Habits", author: "James Clear", added: "2023-07" },
      { title: "The Body Keeps the Score", author: "Bessel van der Kolk", added: "2023-07", done: true },
      { title: "How to Talk So Little Kids Will Listen", author: "Joanna Faber & Julie King", added: "2023-07", done: true },
    ],
  },
  {
    name: "Everything else",
    books: [
      { title: "Big Dumb Eyes", author: "Nate Bargatze", added: "2025-06", done: true },
      { title: "Preventive Medicine", author: "Rollo Tomassi", added: "2021-12", done: true },
      { title: "The Rational Male", author: "Rollo Tomassi", added: "2021-08", done: true },
      { title: "The Rational Male: Positive Masculinity, Vol. 3", author: "Rollo Tomassi", added: "2021-08" },
      { title: "Secret Manipulation Techniques", author: "Liam Robinson", added: "2021-06", done: true },
    ],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatAdded(added) {
  const [year, month, day] = added.split("-").map(Number);
  return day ? `${MONTHS[month - 1]} ${day}, ${year}` : `${MONTHS[month - 1]} ${year}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function status(done) {
  return el("span", done ? "book-status is-done" : "book-status", done ? "Finished" : "In progress");
}

const copiesOf = (book) => book.copies || 1;

function renderReading() {
  const statsRoot = document.querySelector("#reading-stats");
  const aiRoot = document.querySelector("#reading-ai");
  const groupsRoot = document.querySelector("#reading-groups");
  if (!statsRoot || !aiRoot || !groupsRoot) return;

  const all = [...AI_BOOKS, ...BOOK_GROUPS.flatMap((group) => group.books)];
  const total = all.reduce((sum, book) => sum + copiesOf(book), 0);
  const finished = all.filter((book) => book.done).length;
  [
    [total, "books"],
    [finished, "finished"],
    [AI_BOOKS.length, "on AI"],
  ].forEach(([value, label]) => {
    const stat = el("p", "reading-stat");
    stat.append(el("strong", "", String(value)), el("span", "", label));
    statsRoot.append(stat);
  });

  AI_BOOKS.forEach((book) => {
    const item = el("li", "ai-book");
    const meta = el("p", "ai-book-meta", `Added ${formatAdded(book.added)} · ${book.length}`);
    item.append(el("h3", "", book.title), el("p", "ai-book-author", book.author), meta, status(book.done));
    aiRoot.append(item);
  });

  BOOK_GROUPS.forEach((group) => {
    const block = el("div", "book-group");
    const heading = el("h3", "book-group-title", group.name);
    heading.append(el("span", "", String(group.books.reduce((n, b) => n + copiesOf(b), 0))));
    const list = el("ul", "book-list");
    group.books.forEach((book) => {
      const item = el("li");
      const text = el("div");
      text.append(el("p", "book-title", book.title), el("p", "book-author", book.author));
      const side = el("div", "book-side");
      side.append(el("span", "book-date", formatAdded(book.added)));
      if (book.done) side.append(status(true));
      item.append(text, side);
      list.append(item);
    });
    block.append(heading, list);
    groupsRoot.append(block);
  });
}

renderReading();
