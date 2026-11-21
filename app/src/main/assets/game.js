const el = id => document.getElementById(id);
const labels = {
  tr: {
    mode: "Oyun modu", stage: "10 soruluk tur", series: "50 soruluk seri", seriesInfo: "İlk yanlışta veya süre dolduğunda seri biter.", language: "Dil", intro: "Bir şehir seç, bildiklerini test et.", cities: "Şehirler", search: "Şehir ara",
    play: "Oyna", back: "Şehirlere dön", next: "Sonraki soru", result: "Sonucu gör",
    correct: "Doğru!", answer: "Doğru cevap", time: "Süre doldu.", score: "puan",
    empty: "Eşleşen şehir yok.", error: "Şu anda yüklenemedi. Yeniden dene.",
    info: "Her tur 10 soru. Soru başına 10 saniye.", local: "Bu turun puanı oturum sonunda burada gösterilir.",
    alanya: "Muz ve avokado bahçeleri, kale surları ve Akdeniz güneşi.",
  },
  en: {
    mode: "Game mode", stage: "10-question round", series: "50-question streak", seriesInfo: "The streak ends on the first wrong answer or timeout.", language: "Language", intro: "Pick a city and see how well you know it.", cities: "Cities", search: "Search cities",
    play: "Play", back: "Back to cities", next: "Next question", result: "See results",
    correct: "Correct!", answer: "Correct answer", time: "Time’s up.", score: "points",
    empty: "No matching cities.", error: "Couldn’t load. Please try again.",
    info: "10 questions per round. 10 seconds per question.", local: "Your score for this round is shown here.",
    alanya: "Banana and avocado groves, castle walls and Mediterranean sun.",
  },
};
let cities = [];
let locale = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "tr";
el("locale").value = locale;
const text = () => labels[locale];

function renderLobby() {
  document.documentElement.lang = locale;
  document.title = locale === "tr" ? "Şehir Dedektifi" : "How Local Are You?";
  el("brand").textContent = el("title").textContent = document.title;
  el("language-label").textContent = text().language;
  for (const [id, view, tr, en] of [["profile-link","profile","Profilim","My Profile"],["rank-link","rankings","Sıralama","Rankings"]]) {
    el(id).textContent = locale === "en" ? en : tr;
    el(id).href = "./alanya.html?" + new URLSearchParams({view,lang:locale});
  }
  el("intro").textContent = text().intro;
  el("city-heading").textContent = text().cities;
  el("search").placeholder = text().search;
  el("search").setAttribute("aria-label", text().search);
  const fold = value => value.toLocaleLowerCase(locale).normalize("NFD").replace(/\p{M}/gu, "").replaceAll("ı", "i");
  const query = fold(el("search").value.trim());
  const cards = [["alanya", "Alanya", "Alanya", text().alanya, text().alanya], ...cities]
    .filter(([slug, tr, en]) => [slug, tr, en].some(name => fold(name).includes(query)))
    .map(([slug, tr, en, trDescription, enDescription]) => {
      const card = document.createElement("article");
      card.className = "card";
      const name = locale === "tr" ? tr : en;
      const title = document.createElement("h3");
      title.textContent = name;
      const description = document.createElement("p");
      description.textContent = locale === "tr" ? trDescription : enDescription;
      const action = document.createElement("a");
      action.dataset.city = slug;
      action.textContent = text().play;
      action.setAttribute("aria-label", `${text().play} · ${name}`);
      const params = new URLSearchParams({city:slug, lang:locale});
      action.href = "./alanya.html?" + params;
      action.className = "action";
      card.append(title, description, action);
      return card;
    });
  el("cities").replaceChildren(...cards);
  el("status").textContent = cards.length ? "" : text().empty;
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

el("locale").onchange = () => {
  locale = el("locale").value;
  renderLobby();
};
el("search").oninput = renderLobby;
renderLobby();
fetchJson("./cities.json").then(data => {
  cities = data;
  renderLobby();
}).catch(() => { el("status").textContent = text().error; });
